import "./index.less";
import jquery from "jquery";
window.$ = window.jQuery = jquery
/**
 * Helper Functions
 */
let itemsNumber = 0
const addRandomWidthItem = (containerSelector) => {
  const width = Math.random() * 60 + 30;
  const item = $(`<li style="width:${width}px">${itemsNumber++}</li>`);
  $(containerSelector).append(item);
  item.click(() => {
    item.remove();
    truncateList("#list li", item.index())
  })
}

/**
 * Algorithm
 */
// Const Variables
const ListSelector = "#list li";
const ContainerSelector = ".container";

const getBarrierItem = index => $(ListSelector).eq(index);

const shouldCollapsed = () => {
  const contentWidth = $(ContainerSelector)[0].scrollWidth;
  const maxWidth = $(ContainerSelector).width();
  return contentWidth > maxWidth;
}

const changeBarrierItem = position => {
  $(ListSelector).removeClass("barrier");
  getBarrierItem(position).addClass("barrier");
}

const getNewBarrierPosition = (start, end) => Math.floor((start + end) / 2);

const setBarrierItem = (start, end) => {
  if (start > end) {
    [end, start] = [start, end];
  }
  if (end - start === 1 || start === end) {
    changeBarrierItem(start);
    if (shouldCollapsed()) {
      changeBarrierItem(end);
    }
    return;
  }
  const current = getNewBarrierPosition(start, end);
  changeBarrierItem(current);
  if (shouldCollapsed()) {
    setBarrierItem(start, current);
  } else {
    setBarrierItem(current, end);
  }
}

function truncateList(selector, start) {
  $(ContainerSelector).removeClass("collapsed");
  $(".barrier").removeClass("barrier");
  if (shouldCollapsed()) {
    $(ContainerSelector).addClass("collapsed");
    setBarrierItem(start || 0, $(selector).length);
  }
}

$(document).ready(() => {
  const list = $("#list");

  $("#addItem").click(() => {
    addRandomWidthItem("#list");
    truncateList(ListSelector);
  });

  $(".expand-label").click(() => {
    $(ContainerSelector).addClass("expanded").removeClass("collapsed");
    $(".barrier").removeClass("barrier");
  })

  $(document.body).click(event => {
    const target = $(event.target);
    const shouldHide = event.target &&
      (target.closest(ContainerSelector).length === 0 &&
        target.closest("#addItem").length === 0);
    if (shouldHide && !target.is("li")) {
      $(ContainerSelector).removeClass("expanded");
      truncateList(ListSelector);
    }
  })
});