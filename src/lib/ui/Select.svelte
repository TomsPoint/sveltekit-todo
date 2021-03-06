<script lang="ts">
  // @ts-nocheck
  import { uid } from "$lib/basics/utils";

  export let id = uid();
  export let label = "";

  // the list of items  the user can select from
  export let items = [];

  // function to use to get all items (alternative to providing items)
  export let searchFunction = false;

  // field of each item that's used for the labels in the list
  export let labelFieldName = undefined;
  export let keywordsFieldName = labelFieldName;
  export let valueFieldName = undefined;
  export let tagFieldName = undefined;

  export let labelFunction = function (item) {
    if (item === undefined || item === null) {
      return "";
    }
    return labelFieldName ? item[labelFieldName] : item;
  };
  export let tagLabelFunction = function (item) {
    if (item === undefined || item === null) {
      return "";
    }
    return tagFieldName ? item[tagFieldName] : labelFieldName ? item[labelFieldName] : item;
  };

  export let keywordsFunction = function (item) {
    if (item === undefined || item === null) {
      return "";
    }
    return keywordsFieldName ? item[keywordsFieldName] : labelFunction(item);
  };

  export let valueFunction = function (item, forceSingle = false) {
    if (item === undefined || item === null) {
      return item;
    }
    if (!multiple || forceSingle) {
      return valueFieldName ? item[valueFieldName] : item;
    } else {
      return item.map((i) => (valueFieldName ? i[valueFieldName] : i));
    }
  };

  export let keywordsCleanFunction = function (keywords) {
    return keywords;
  };

  export let textCleanFunction = function (userEnteredText) {
    return userEnteredText;
  };

  // events
  export let beforeChange = function (oldSelectedItem, newSelectedItem) {
    return true;
  };
  export let onChange = function (newSelectedItem) {};
  export let onFocus = function () {};
  export let onBlur = function () {};
  export let onCreate = function (text) {
    if (debug) {
      console.log("onCreate: " + text);
    }
  };

  // Behaviour properties
  export let selectFirstIfEmpty = false;
  export let minCharactersToSearch = 1;
  export let maxItemsToShowInList = 0;
  export let multiple = false;
  export let create = false;

  // ignores the accents when matching items
  export let ignoreAccents = true;

  // all the input keywords should be matched in the item keywords
  export let matchAllKeywords = true;

  // sorts the items by the number of matchink keywords
  export let sortByMatchedKeywords = false;

  // allow users to use a custom item filter function
  export let itemFilterFunction = undefined;

  // allow users to use a custom item sort function
  export let itemSortFunction = undefined;

  // do not allow re-selection after initial selection
  export let lock = false;

  // delay to wait after a keypress to search for new items
  export let delay = 0;

  // true to perform local filtering of items, even if searchFunction is provided
  export let localFiltering = true;

  // UI properties

  // option to hide the dropdown arrow
  export let hideArrow = false;

  // option to show clear selection button
  export let showClear = false;

  // option to show loading indicator when the async function is executed
  export let showLoadingIndicator = false;

  // text displayed when no items match the input text
  export let noResultsText = "No results found";

  // text displayed when async data is being loaded
  export let loadingText = "Loading results...";

  // text displayed when async data is being loaded
  export let createText = "Not found, add anyway?";

  // the text displayed when no option is selected
  export let placeholder = undefined;

  // apply a className to the control
  export let className = undefined;
  // apply a containerClassName to the container
  export let containerClassName = undefined;

  // HTML input UI properties
  // apply a className to the input control
  export let inputClassName = undefined;
  // apply a id to the input control
  export let inputId = undefined;
  // generate an HTML input with this name
  export let name = undefined;
  // generate a <select> tag that holds the value
  export let selectName = undefined;
  // apply a id to the <select>
  export let selectId = undefined;
  // add the title to the HTML input
  export let title = undefined;
  // enable the html5 autocompletion to the HTML input
  export let html5autocomplete = undefined;
  // make the input readonly
  export let readonly = undefined;
  // apply a className to the dropdown div
  export let dropdownClassName = undefined;
  // adds the disabled tag to the HTML input
  export let disabled = false;

  export let debug = false;

  // --- Public State ----

  // selected item state
  export let selectedItem = multiple ? [] : undefined;
  export let value = undefined;
  export let highlightedItem = undefined;

  // --- Internal State ----
  const uniqueId = "sautocomplete-" + Math.floor(Math.random() * 1000);

  // HTML elements
  let input;
  let list;

  // UI state
  let opened = false;
  let loading = false;
  let highlightIndex = -1;
  export let text = "";
  let filteredTextLength = 0;

  // view model
  let filteredListItems;
  let listItems = [];

  // requests/responses counters
  let lastRequestId = 0;
  let lastResponseId = 0;

  // other state
  let inputDelayTimeout;

  // --- Functions ---
  function safeStringFunction(theFunction, argument) {
    if (typeof theFunction !== "function") {
      console.error("Not a function: " + theFunction + ", argument: " + argument);
    }
    let originalResult;
    try {
      originalResult = theFunction(argument);
    } catch (error) {
      console.warn("Error executing Autocomplete function on value: " + argument + " function: " + theFunction);
    }
    let result = originalResult;
    if (result === undefined || result === null) {
      result = "";
    }
    if (typeof result !== "string") {
      result = result.toString();
    }
    return result;
  }

  function safeLabelFunction(item) {
    // console.log("labelFunction: " + labelFunction);
    // console.log("safeLabelFunction, item: " + item);
    return safeStringFunction(labelFunction, item);
  }
  function safeTagLabelFunction(item) {
    // console.log("labelFunction: " + labelFunction);
    // console.log("safeLabelFunction, item: " + item);
    return safeStringFunction(tagLabelFunction, item);
  }

  function safeKeywordsFunction(item) {
    // console.log("safeKeywordsFunction");
    const keywords = safeStringFunction(keywordsFunction, item);
    let result = safeStringFunction(keywordsCleanFunction, keywords);
    result = result.toLowerCase().trim();
    if (ignoreAccents) {
      result = removeAccents(result);
    }

    if (debug) {
      console.log("Extracted keywords: '" + result + "' from item: " + JSON.stringify(item));
    }
    return result;
  }

  function prepareListItems() {
    let timerId;
    if (debug) {
      timerId = `Autocomplete prepare list ${inputId ? `(id: ${inputId})` : ""}`;
      console.time(timerId);
      console.log("Prepare items to search");
      console.log("items: " + JSON.stringify(items));
    }

    if (!Array.isArray(items)) {
      console.warn("Autocomplete items / search function did not return array but", items);
      items = [];
    }

    const length = items ? items.length : 0;
    listItems = new Array(length);

    if (length > 0) {
      items.forEach((item, i) => {
        const listItem = getListItem(item);
        if (listItem == undefined) {
          console.log("Undefined item for: ", item);
        }
        listItems[i] = listItem;
      });
    }

    if (debug) {
      console.log(listItems.length + " items to search");
      console.timeEnd(timerId);
    }
  }

  function getListItem(item) {
    return {
      // keywords representation of the item
      keywords: safeKeywordsFunction(item),
      // item label
      label: safeLabelFunction(item),
      // store reference to the origial item
      item: item,
    };
  }

  // -- Reactivity --
  $: items, prepareListItems();

  function onSelectedItemChanged() {
    value = valueFunction(selectedItem);
    text = !multiple ? safeLabelFunction(selectedItem) : "";

    filteredListItems = listItems;
    onChange(selectedItem);
  }

  $: selectedItem, onSelectedItemChanged();

  $: highlightedItem =
    filteredListItems && highlightIndex && highlightIndex >= 0 && highlightIndex < filteredListItems.length ? filteredListItems[highlightIndex].item : null;

  $: showList = opened && ((items && items.length > 0) || filteredTextLength > 0);

  $: clearable = showClear || ((lock || multiple) && selectedItem);

  function prepareUserEnteredText(userEnteredText) {
    if (userEnteredText === undefined || userEnteredText === null) {
      return "";
    }

    const textFiltered = userEnteredText.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ").trim();

    filteredTextLength = textFiltered.length;

    if (minCharactersToSearch > 1) {
      if (filteredTextLength < minCharactersToSearch) {
        return "";
      }
    }

    const cleanUserEnteredText = textCleanFunction(textFiltered);
    const textFilteredLowerCase = cleanUserEnteredText.toLowerCase().trim();

    if (debug) {
      console.log("Change user entered text '" + userEnteredText + "' into '" + textFilteredLowerCase + "'");
    }
    return textFilteredLowerCase;
  }

  function numberOfMatches(listItem, searchWords) {
    if (!listItem) {
      return 0;
    }

    const itemKeywords = listItem.keywords;

    let matches = 0;
    searchWords.forEach((searchWord) => {
      if (itemKeywords.includes(searchWord)) {
        matches++;
      }
    });

    return matches;
  }

  async function search() {
    let timerId;
    if (debug) {
      timerId = `Autocomplete search ${inputId ? `(id: ${inputId})` : ""})`;
      console.time(timerId);
      console.log("Searching user entered text: '" + text + "'");
    }

    const textFiltered = prepareUserEnteredText(text);

    if (textFiltered === "") {
      if (searchFunction) {
        // we will need to rerun the search
        items = [];
        if (debug) {
          console.log("User entered text is empty clear list of items");
        }
      } else {
        filteredListItems = listItems;
        if (debug) {
          console.log("User entered text is empty set the list of items to all items");
        }
      }
      closeIfMinCharsToSearchReached();
      if (debug) {
        console.timeEnd(timerId);
      }
      return;
    }

    if (!searchFunction) {
      processListItems(textFiltered);
    }

    // external search which provides items
    else {
      lastRequestId = lastRequestId + 1;
      const currentRequestId = lastRequestId;
      loading = true;

      // searchFunction is a generator
      if (searchFunction.constructor.name === "AsyncGeneratorFunction") {
        for await (const chunk of searchFunction(textFiltered)) {
          // a chunk of an old response: throw it away
          if (currentRequestId < lastResponseId) {
            return false;
          }

          // a chunk for a new response: reset the item list
          if (currentRequestId > lastResponseId) {
            items = [];
          }

          lastResponseId = currentRequestId;
          items = [...items, ...chunk];
          processListItems(textFiltered);
        }

        // there was nothing in the chunk
        if (lastResponseId < currentRequestId) {
          lastResponseId = currentRequestId;
          items = [];
          processListItems(textFiltered);
        }
      }

      // searchFunction is a regular function
      else {
        let result = await searchFunction(textFiltered);

        // If a response to a newer request has been received
        // while responses to this request were being loaded,
        // then we can just throw away this outdated results.
        if (currentRequestId < lastResponseId) {
          return false;
        }

        lastResponseId = currentRequestId;
        items = result;
        processListItems(textFiltered);
      }

      loading = false;
    }

    if (debug) {
      console.timeEnd(timerId);
      console.log("Search found " + filteredListItems.length + " items");
    }
  }

  function defaultItemFilterFunction(listItem, searchWords) {
    var matches = numberOfMatches(listItem, searchWords);
    if (matchAllKeywords) {
      return matches >= searchWords.length;
    } else {
      return matches > 0;
    }
  }

  function defaultItemSortFunction(obj1, obj2, searchWords) {
    return numberOfMatches(obj2, searchWords) - numberOfMatches(obj1, searchWords);
  }

  function processListItems(textFiltered) {
    // cleans, filters, orders, and highlights the list items
    prepareListItems();

    const textFilteredWithoutAccents = ignoreAccents ? removeAccents(textFiltered) : textFiltered;
    const searchWords = textFilteredWithoutAccents.split(/\s+/g);

    // local search
    let tempfilteredListItems;
    if (localFiltering) {
      if (itemFilterFunction) {
        tempfilteredListItems = listItems.filter((item) => itemFilterFunction(item.item, searchWords));
      } else {
        tempfilteredListItems = listItems.filter((item) => defaultItemFilterFunction(item, searchWords));
      }

      if (itemSortFunction) {
        tempfilteredListItems = tempfilteredListItems.sort((item1, item2) => itemSortFunction(item1.item, item2.item, searchWords));
      } else {
        if (sortByMatchedKeywords) {
          tempfilteredListItems = tempfilteredListItems.sort((item1, item2) => defaultItemSortFunction(item1, item2, searchWords));
        }
      }
    } else {
      tempfilteredListItems = listItems;
    }

    const hlfilter = highlightFilter(searchWords, "label");
    const filteredListItemsHighlighted = tempfilteredListItems.map(hlfilter);

    filteredListItems = filteredListItemsHighlighted;
    closeIfMinCharsToSearchReached();
    return true;
  }

  // $: text, search();

  function selectListItem(listItem) {
    if (debug) {
      console.log("selectListItem", listItem);
    }
    if ("undefined" === typeof listItem && create) {
      // allow undefined items if create is enabled
      const createdItem = onCreate(text);
      if ("undefined" !== typeof createdItem) {
        prepareListItems();
        filteredListItems = listItems;
        const index = findItemIndex(createdItem, filteredListItems);
        if (index >= 0) {
          highlightIndex = index;
          listItem = filteredListItems[highlightIndex];
        }
      }
    }

    if ("undefined" === typeof listItem) {
      if (debug) {
        console.log(`listItem is undefined. Can not select.`);
      }
      return false;
    }

    const newSelectedItem = listItem.item;
    if (beforeChange(selectedItem, newSelectedItem)) {
      // simple selection
      if (!multiple) {
        selectedItem = undefined; // triggers change even if the the same item is selected
        selectedItem = newSelectedItem;
      }
      // first selection of multiple ones
      else if (!selectedItem) {
        selectedItem = [newSelectedItem];
      }
      // selecting something already selected => unselect it
      else if (selectedItem.includes(newSelectedItem)) {
        selectedItem = selectedItem.filter((i) => i !== newSelectedItem);
      }
      // adds the element to the selection
      else {
        selectedItem = [...selectedItem, newSelectedItem];
      }
    }
    return true;
  }

  function selectItem() {
    if (debug) {
      console.log("selectItem", highlightIndex);
    }
    const listItem = filteredListItems[highlightIndex];
    if (selectListItem(listItem)) {
      close();
      if (multiple) {
        input.focus();
      }
    }
  }

  function up() {
    if (debug) {
      console.log("up");
    }

    open();
    if (highlightIndex > 0) {
      highlightIndex--;
    }

    highlight();
  }

  function down() {
    if (debug) {
      console.log("down");
    }

    open();
    if (highlightIndex < filteredListItems.length - 1) {
      highlightIndex++;
    }

    highlight();
  }

  function highlight() {
    if (debug) {
      console.log("highlight");
    }

    const query = ".selected";
    if (debug) {
      console.log("Seaching DOM element: " + query + " in " + list);
    }
    const el = list && list.querySelector(query);
    if (el) {
      if (typeof el.scrollIntoViewIfNeeded === "function") {
        if (debug) {
          console.log("Scrolling selected item into view");
        }
        el.scrollIntoViewIfNeeded();
      } else {
        if (debug) {
          console.warn("Could not scroll selected item into view, scrollIntoViewIfNeeded not supported");
        }
      }
    } else {
      if (debug) {
        console.warn("Selected item not found to scroll into view");
      }
    }
  }

  function onListItemClick(listItem) {
    if (debug) {
      console.log("onListItemClick");
    }

    if (selectListItem(listItem)) {
      close();
      if (multiple) {
        input.focus();
      }
    }
  }

  function onDocumentClick(e) {
    if (debug) {
      console.log("onDocumentClick: " + JSON.stringify(e.composedPath()));
    }
    if (e.composedPath().some((path) => path.classList && path.classList.contains(uniqueId))) {
      if (debug) {
        console.log("onDocumentClick inside");
      }
      // resetListToAllItemsAndOpen();
      highlight();
    } else {
      if (debug) {
        console.log("onDocumentClick outside");
      }
      close();
    }
  }

  function onKeyDown(e) {
    if (debug) {
      console.log("onKeyDown");
    }

    let key = e.key;
    if (key === "Tab" && e.shiftKey) key = "ShiftTab";
    const fnmap = {
      Tab: opened ? down.bind(this) : null,
      ShiftTab: opened ? up.bind(this) : null,
      ArrowDown: down.bind(this),
      ArrowUp: up.bind(this),
      Escape: onEsc.bind(this),
      Backspace: multiple && selectedItem && selectedItem.length && !text ? onBackspace.bind(this) : null,
    };
    const fn = fnmap[key];
    if (typeof fn === "function") {
      fn(e);
    }
  }

  function onKeyPress(e) {
    if (debug) {
      console.log("onKeyPress");
    }

    if (e.key === "Enter" && opened) {
      e.preventDefault();
      onEnter();
    }
  }

  function onEnter() {
    selectItem();
  }

  function onInput(e) {
    if (debug) {
      console.log("onInput");
    }

    text = e.target.value;
    if (inputDelayTimeout) {
      clearTimeout(inputDelayTimeout);
    }

    if (delay) {
      inputDelayTimeout = setTimeout(processInput, delay);
    } else {
      processInput();
    }
  }

  function unselectItem(tag) {
    if (debug) {
      console.log("unselectItem", tag);
    }
    selectedItem = selectedItem.filter((i) => i !== tag);
    input.focus();
  }

  function processInput() {
    if (search()) {
      highlightIndex = 0;
      open();
    }
  }

  function onInputClick() {
    if (debug) {
      console.log("onInputClick");
    }
    resetListToAllItemsAndOpen();
  }

  function onEsc(e) {
    if (debug) {
      console.log("onEsc");
    }

    //if (text) return clear();
    e.stopPropagation();
    if (opened) {
      input.focus();
      close();
    }
  }

  function onBackspace(e) {
    if (debug) {
      console.log("onBackspace");
    }

    unselectItem(selectedItem[selectedItem.length - 1]);
  }

  function onFocusInternal() {
    if (debug) {
      console.log("onFocus");
    }

    onFocus();

    resetListToAllItemsAndOpen();
  }

  function onBlurInternal() {
    if (debug) {
      console.log("onBlur");
    }

    onBlur();
  }

  function resetListToAllItemsAndOpen() {
    if (debug) {
      console.log("resetListToAllItemsAndOpen");
    }

    if (!text) {
      filteredListItems = listItems;
    }

    // When an async component is initialized, the item list
    // must be loaded when the input is focused.
    else if (!listItems.length && selectedItem && searchFunction) {
      search();
    }

    open();

    // find selected item
    if (selectedItem) {
      if (debug) {
        console.log("Searching currently selected item: " + JSON.stringify(selectedItem));
      }

      const index = findItemIndex(selectedItem, filteredListItems);
      if (index >= 0) {
        highlightIndex = index;
        highlight();
      }
    }
  }

  function findItemIndex(item, items) {
    if (debug) {
      console.log("Finding index for item", item);
    }
    let index = -1;
    for (let i = 0; i < items.length; i++) {
      const listItem = items[i];
      if ("undefined" === typeof listItem) {
        if (debug) {
          console.log(`listItem ${i} is undefined. Skipping.`);
        }
        continue;
      }
      if (debug) {
        console.log("Item " + i + ": " + JSON.stringify(listItem));
      }
      if (item == listItem.item) {
        index = i;
        break;
      }
    }

    if (debug) {
      if (index >= 0) {
        console.log("Found index for item: " + index);
      } else {
        console.warn("Not found index for item: " + item);
      }
    }
    return index;
  }

  function open() {
    if (debug) {
      console.log("open");
    }

    // check if the search text has more than the min chars required
    if (isMinCharsToSearchReached()) {
      return;
    }

    opened = true;
  }

  function close() {
    if (debug) {
      console.log("close");
    }
    opened = false;
    loading = false;

    if (!text && selectFirstIfEmpty) {
      highlightIndex = 0;
      selectItem();
    }
  }

  function isMinCharsToSearchReached() {
    return minCharactersToSearch > 1 && filteredTextLength < minCharactersToSearch;
  }

  function closeIfMinCharsToSearchReached() {
    if (isMinCharsToSearchReached()) {
      close();
    }
  }

  function clear() {
    if (debug) {
      console.log("clear");
    }

    text = "";
    selectedItem = multiple ? [] : undefined;

    setTimeout(() => {
      input.focus();
      close();
    });
  }

  export function highlightFilter(keywords, field) {
    return (item) => {
      let label = item[field];

      const newItem = Object.assign({ highlighted: undefined }, item);
      newItem.highlighted = label;

      const labelLowercase = label.toLowerCase();
      const labelLowercaseNoAc = ignoreAccents ? removeAccents(labelLowercase) : labelLowercase;

      if (keywords && keywords.length) {
        const positions = [];

        for (let i = 0; i < keywords.length; i++) {
          let keyword = keywords[i];
          if (ignoreAccents) {
            keyword = removeAccents(keyword);
          }
          const keywordLen = keyword.length;

          let pos1 = 0;
          do {
            pos1 = labelLowercaseNoAc.indexOf(keyword, pos1);
            if (pos1 >= 0) {
              let pos2 = pos1 + keywordLen;
              positions.push([pos1, pos2]);
              pos1 = pos2;
            }
          } while (pos1 !== -1);
        }

        if (positions.length > 0) {
          const keywordPatterns = new Set();
          for (let i = 0; i < positions.length; i++) {
            const pair = positions[i];
            const pos1 = pair[0];
            const pos2 = pair[1];

            const keywordPattern = labelLowercase.substring(pos1, pos2);
            keywordPatterns.add(keywordPattern);
          }
          for (let keywordPattern of keywordPatterns) {
            // FIXME pst: workarond for wrong replacement <b> tags
            if (keywordPattern === "b") {
              continue;
            }
            const reg = new RegExp("(" + keywordPattern + ")", "ig");

            const newHighlighted = newItem.highlighted.replace(reg, "<b>$1</b>");
            newItem.highlighted = newHighlighted;
          }
        }
      }

      return newItem;
    };
  }

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function isConfirmed(listItem) {
    if (!selectedItem) {
      return false;
    }
    if (multiple) {
      return selectedItem.includes(listItem);
    } else {
      return listItem == selectedItem;
    }
  }
</script>

<div class="grid gap-0 mb-2 {containerClassName ? containerClassName : ''}">
  <label class="text-sm" for={id}>{label}</label>
  <div
    class="{className ? className : ''}
  {hideArrow || !items.length ? 'hide-arrow' : ''}
  {multiple ? 'is-multiple' : ''} autocomplete select is-fullwidth {uniqueId}"
    class:show-clear={clearable}
    class:is-loading={showLoadingIndicator && loading}
  >
    <select name={selectName} id={selectId} {multiple} on:change>
      {#if !multiple && value}
        <option {value} selected>{text}</option>
      {:else if multiple && selectedItem}
        {#each selectedItem as i}
          <option value={valueFunction(i, true)} selected>
            {safeLabelFunction(i)}
          </option>
        {/each}
      {/if}
    </select>
    <div class="input-container">
      {#if multiple && selectedItem}
        {#each selectedItem as tagItem}
          <slot name="tag" label={safeLabelFunction(tagItem)} item={tagItem} {unselectItem}>
            <div class="tags has-addons">
              <span class="tag">{safeTagLabelFunction(tagItem)}</span>
              <span class="tag is-delete" on:click|preventDefault={unselectItem(tagItem)}>✕</span>
            </div>
          </slot>
        {/each}
      {/if}
      <input
        type="text"
        class="{inputClassName ? inputClassName : ''} input autocomplete-input"
        id={inputId ? inputId : ""}
        autocomplete={html5autocomplete ? "on" : "some-other-text"}
        {placeholder}
        {name}
        {disabled}
        {title}
        readonly={readonly || (lock && selectedItem)}
        bind:this={input}
        bind:value={text}
        on:input={onInput}
        on:focus={onFocusInternal}
        on:blur={onBlurInternal}
        on:keydown={onKeyDown}
        on:click={onInputClick}
        on:keypress={onKeyPress}
        on:change
      />
      {#if clearable}
        <span on:click={clear} class="autocomplete-clear-button">✕</span>
      {/if}
    </div>
    <div
      class="{dropdownClassName ? dropdownClassName : ''} autocomplete-list {showList ? '' : 'hidden'}
    is-fullwidth"
      bind:this={list}
    >
      {#if filteredListItems && filteredListItems.length > 0}
        {#each filteredListItems as listItem, i}
          {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}
            {#if listItem}
              <div
                class="autocomplete-list-item {i === highlightIndex ? 'selected' : ''}"
                class:confirmed={isConfirmed(listItem.item)}
                on:click={() => onListItemClick(listItem)}
                on:pointerenter={() => {
                  highlightIndex = i;
                }}
              >
                <slot name="item" item={listItem.item} label={listItem.highlighted ? listItem.highlighted : listItem.label}>
                  {#if listItem.highlighted}
                    {@html listItem.highlighted}
                  {:else}
                    {@html listItem.label}
                  {/if}
                </slot>
              </div>
            {/if}
          {/if}
        {/each}

        {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}
          <div class="autocomplete-list-item-no-results">
            ...{filteredListItems.length - maxItemsToShowInList} results not shown
          </div>
        {/if}
      {:else if loading && loadingText}
        <div class="autocomplete-list-item-loading">
          <slot name="loading" {loadingText}>{loadingText}</slot>
        </div>
      {:else if create}
        <div class="autocomplete-list-item-create" on:click={selectItem}>
          <slot name="create" {createText}>{createText}</slot>
        </div>
      {:else if noResultsText}
        <div class="autocomplete-list-item-no-results">
          <slot name="no-results" {noResultsText}>{noResultsText}</slot>
        </div>
      {/if}
    </div>
  </div>
</div>
<svelte:window on:click={onDocumentClick} />

<style lang="postcss">
  .autocomplete {
    @apply inline-block max-w-full min-w-[200px] relative align-top border-none;
  }
  .autocomplete .input-container {
    @apply absolute top-0 bottom-0 left-0 right-0 p-0 border-none shadow-none;
  }
  .autocomplete .input-container .input {
    @apply !bg-none !cursor-text;
  }

  .autocomplete:not(.hide-arrow):not(.is-loading)::after {
    content: "";
    @apply z-10 absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2  border-gray-400 border-l-[1.8px] border-b-[1.8px] -rotate-45 cursor-pointer;
  }

  .autocomplete.show-clear:not(.hide-arrow)::after {
    @apply right-3;
  }

  .autocomplete-input {
    @apply w-full h-full py-1 px-4;
  }

  .autocomplete:not(.hide-arrow) .autocomplete-input {
    @apply pr-8;
  }
  .autocomplete.show-clear:not(.hide-arrow) .autocomplete-input {
    @apply pr-12;
  }
  .autocomplete.hide-arrow.show-clear .autocomplete-input {
    @apply pr-8;
  }

  .autocomplete-list {
    @apply relative w-full overflow-y-auto z-50 mt-1 p-1 bg-white top-full border rounded-sm;
    max-height: calc(15 * (1rem + 10px) + 15px);
    user-select: none;
  }
  .autocomplete-list:empty {
    padding: 0;
  }
  .autocomplete-list-item {
    @apply text-gray-800 py-1 px-4 cursor-pointer odd:bg-gray-50;
  }

  .autocomplete-list-item.confirmed {
    @apply bg-yellow-100 text-gray-800;
  }
  .autocomplete-list-item.selected {
    @apply bg-yellow-200 text-gray-800;
  }
  .autocomplete-list-item-no-results {
    @apply text-gray-400 py-1 px-4 cursor-pointer;
  }
  .autocomplete-list-item-create {
    @apply py-1 px-4;
  }
  .autocomplete-list-item-loading {
    @apply py-1 px-4;
  }

  .autocomplete-list.hidden {
    display: none;
  }

  .autocomplete.show-clear .autocomplete-clear-button {
    @apply z-10 absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer;
  }
  .is-multiple.autocomplete:not(.hide-arrow):not(.is-loading)::after {
    content: "";
    @apply right-8;
  }

  .autocomplete:not(.show-clear) .autocomplete-clear-button {
    display: none;
  }

  .autocomplete select {
    display: none;
  }
  .autocomplete.is-multiple {
    @apply border rounded-sm;
  }

  .autocomplete.is-multiple .input-container {
    @apply flex flex-wrap place-items-center;
  }

  .autocomplete.is-multiple .tags {
    @apply bg-yellow-100 rounded-3xl grid gap-2 px-2 py-1 ml-1 grid-cols-[repeat(2,auto)] place-items-center leading-none uppercase text-sm;
  }

  .autocomplete.is-multiple .tag.is-delete {
    @apply cursor-pointer text-xs py-[0.1rem];
  }

  .autocomplete.is-multiple .autocomplete-input {
    display: flex;
    width: 100%;
    flex: 1 1 50px;
    min-width: 3em;
    border: none;
    background: none;
  }
  .autocomplete.select.is-multiple {
    @apply border rounded-sm border-solid focus:ring-2 ring-yellow-500 ring-offset-0 focus:outline-none;
  }
</style>
