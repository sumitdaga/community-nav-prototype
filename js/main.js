/**
 * get offset of element
 * @param {dom element} el 
 */
function offset(el) {
  if (!el) {
    return { top: 0, left: 0 };
  }
  var rect = el.getBoundingClientRect();
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

/**
 * remove class from element
 * @param {element} el 
 * @param {classname} classname 
 */
function removeClass(el, classname) {
  return iterateElement(el, function(elIterate){
    elIterate.classList.remove(classname);
  });
}

/**
 * set attribute
 * @param {element} el 
 * @param {key} key 
 * @param {value} value 
 */
function setAttribute(el, key, value) {
  return iterateElement(el, function(elIterate){
    elIterate.setAttribute(key, value);
  });
}

/**
 * set html
 * @param {element} el 
 * @param {html} html 
 */
function setHTML(el, html) {
  return iterateElement(el, function(elIterate){
    elIterate.innerHTML = html;
  });
}

/**
 * add class to element
 * @param {element} el 
 * @param {classname} classname 
 */
function addClass(el, classname) {
  return iterateElement(el, function(elIterate){
    elIterate.classList.add(classname);
  });
}

/**
 * toggle class to element
 * @param {element} el 
 * @param {classname} classname 
 */
function toggleClass(el, classname) {
  return iterateElement(el, function(elIterate){
    elIterate.classList.toggle(classname);
  });
}

/**
 * check if element has class
 * @param {element} el 
 * @param {classname} classname 
 */
function hasClass(el, classname) {
  var hasClass = false;
  iterateElement(el, function(elIterate){
    hasClass = elIterate.classList.contains(classname);
  });
  return hasClass;
}

/**
 * iterate all element
 * @param {element} el 
 * @param {callback} cb 
 */
function iterateElement(el, cb) {
  if (!el) {
    return;
  }
  if (el.classList) {
    if (cb) {
      cb(el);
    }
    return el;
  }
  var list = el;
  for (var i = 0; i < list.length; i++) {
    var ele = list[i];
    if (cb) {
      cb(ele);
    }
  }
  return el;
}

/**
 * get list closest child of the element
 * @param {element} el 
 */
function getTheClosestChild(el) {
  var elements = [];
  for (var i=0; i<el.childNodes.length; i++) {
    var child = el.childNodes[i];
    if (child.nodeType == 1) {
      elements.push(child)      
    }
  }
  return elements;
}

/**
 * get distance between 2 elements
 * @param {element 1} el1 
 * @param {element 2} el2 
 */
function getDistance(el1, el2) {
  var el1Offset = offset(el1);
  if (el2) {
    var el2Offset = offset(el2);
    var distance = el2Offset.left - el1Offset.left - el1.offsetWidth;
    return distance;
  } else {
    var w = window.innerWidth;
    var distance = w - el1Offset.left - el1.offsetWidth;
    return distance;
  }
}

/**
 * remove element
 * @param {element} el 
 */
function removeItem(el) {
  return iterateElement(el, function(elIterate){
    elIterate.parentNode.removeChild(elIterate);
  });
}

// Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
  return (el.offsetParent === null)
}

document.addEventListener("DOMContentLoaded", function() {

  var spaceForShrinkMore = 50; // use for control the distance to the left, if the distance less then this then shrink the menu
  var headerNavUi = document.querySelectorAll('.header-nav-ui')[0];
  var primaryNav = headerNavUi.querySelectorAll('.primary-nav')[0];
  var arrowSelectedPrimaryAnimation = primaryNav.getElementsByClassName('icon-chosen-arrow')[0];
  var secondaryNav = headerNavUi.querySelectorAll('.secondary-nav')[0];
  var arrowSelectedSecondaryAnimation = secondaryNav.getElementsByClassName('icon-select')[0];
  var secondaryNavMobile = headerNavUi.querySelectorAll('.secondary-nav-mobile')[0];
  var mobileNavSubMenu = headerNavUi.querySelectorAll('.mobile-nav-sub-menu')[0];
  var secondaryNavLinkContainer = secondaryNav.querySelectorAll('.secondary-nav-link-container')[0];
  var previousSelectElementDesktop = null;
  var previousLevel2ItemSelectElement = null;
  var selectingLevel1ClassKey = null;

  /**
   * create nav from json object
   */
  function createAndMappingNavData() {
    var primaryLevel1 = primaryNav.querySelectorAll('.primary-level-1.hide')[0];
    var primaryLevel1Separator = primaryNav.querySelectorAll('.primary-level-1-separator.hide')[0];
    var primaryLevel2Container = primaryNav.querySelectorAll('.primary-level-2-container.hide')[0];
    var loginBtn = primaryNav.querySelectorAll('.login-btn')[0];
    // create primary menu level 1
    for (var i = 0; i < navMenus.length; i++) {
      var menuLevel1 = navMenus[i];
      var value = menuLevel1.value;
      var subMenu = menuLevel1.subMenu;

      var primaryLevel1Item = primaryLevel1.cloneNode(true);
      if (!previousSelectElementDesktop) {
        previousSelectElementDesktop = primaryLevel1Item;
      }
      var primaryLevel1SeparatorItem = primaryLevel1Separator.cloneNode(true);
      setHTML(setAttribute(setAttribute(addClass(removeClass(removeClass(primaryLevel1Item, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', i), value);
      addClass(removeClass(removeClass(primaryLevel1SeparatorItem, 'hide'), 'ignore'), 'copied');
      primaryNav.insertBefore(primaryLevel1Item, loginBtn);
      if (i !== navMenus.length - 1) {
        primaryNav.insertBefore(primaryLevel1SeparatorItem, loginBtn);
      }

      if (value === 'MORE') {
        addClass(primaryLevel1Item, 'more-menu');
        continue;
      }
      
      var primaryLevel2ContainerItem = primaryLevel2Container.cloneNode(true);
      addClass(removeClass(primaryLevel2ContainerItem, 'hide'), 'copied');
      primaryNav.insertBefore(primaryLevel2ContainerItem, loginBtn);
      // create primary menu level 2
      var primaryLevel2 = primaryLevel2ContainerItem.querySelectorAll('.primary-level-2.hide')[0];
      var moreBtnContainerLevel2 = primaryLevel2ContainerItem.querySelectorAll('.more-btn-container')[0];
      var moreContentContainer = primaryLevel2ContainerItem.querySelectorAll('.more-content-container')[0];
      var moreContentIgnoreItem = moreContentContainer.querySelectorAll('a.hide')[0];
      for (var j = 0; j < subMenu.length; j++) {
        var menuLevel2 = subMenu[j];
        var value2 = menuLevel2.value;
        var primaryLevel2Item = primaryLevel2.cloneNode(true);
        setHTML(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(primaryLevel2Item, 'hide'), 'ignore'), 'copied'), 'key', value2),'indexLevel1', i),'indexLevel2', j), value2);
        primaryLevel2ContainerItem.insertBefore(primaryLevel2Item, moreBtnContainerLevel2);

        var moreContentItem = moreContentIgnoreItem.cloneNode(true);
        setHTML(setAttribute(setAttribute(addClass(removeClass(moreContentItem, 'ignore'), 'copied'), 'key', value2),'index', i), value2);
        moreContentContainer.appendChild(moreContentItem);
      }
    }

    forceClickToSublevel1(previousSelectElementDesktop);
  }
  createAndMappingNavData();

  /**
   * clear secondary navigation item
   */
  function clearSecondaryNavItem() {
    removeItem(secondaryNav.querySelectorAll('.secondary-level-1.copied, .more-btn-container .more-content-container a.copied'));
    removeItem(mobileNavSubMenu.querySelectorAll('.menu a.copied'));
    removeClass(addClass(arrowSelectedSecondaryAnimation, 'hide'), 'isAnimation');
  }

  /**
   * Populate secondary memu items
   * @param {selected element} target 
   */
  function populateSecondaryNavMobile(target) {
    var indexLevel1 = target.getAttribute('indexLevel1');
    var indexLevel2 = target.getAttribute('indexLevel2');
    var datas = navMenus[indexLevel1].subMenu[indexLevel2];
    var subMenu = datas.subMenu;
    if (!subMenu || !subMenu.length) {
      return;
    }

    // create secondary mobile menu
    var mobileNavSubMenuContainer = mobileNavSubMenu.querySelectorAll('.menu')[0];
    var mobileNavSubMenuIgnoreItem = mobileNavSubMenuContainer.querySelectorAll('a.hide')[0];
    for (var i = 0; i < subMenu.length; i++) {
      var menuLevel1 = subMenu[i];
      var value = menuLevel1.value;

      var mobileNavSubMenuItem = mobileNavSubMenuIgnoreItem.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(mobileNavSubMenuItem, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', indexLevel2),'indexLevel3', i), value);
      mobileNavSubMenuContainer.appendChild(mobileNavSubMenuItem);
    }
  }

  /**
   * populate the secondary menu item base on = selected menu level 2 item
   * @param {selected item level 2} target 
   */
  function populateSecondaryNav(target, directTarget) {
    clearSecondaryNavItem();
    removeClass(mobileNavSubMenu, 'isNothing');
    if (!target) {
      if (directTarget) {
        populateSecondaryNavMobile(directTarget);
      }
      return;
    }

    var indexLevel1 = target.getAttribute('indexLevel1');
    var indexLevel2 = target.getAttribute('indexLevel2');
    var datas = navMenus[indexLevel1].subMenu[indexLevel2];
    var subMenu = datas.subMenu;
    if (!subMenu || !subMenu.length) {
      return;
    }

    // create secondary menu level 1
    var secondaryLevel1 = secondaryNav.querySelectorAll('.secondary-level-1.hide')[0];
    var moreBtnContainer = secondaryNav.querySelectorAll('.more-btn-container')[0];
    var moreContentContainer = moreBtnContainer.querySelectorAll('.more-content-container')[0];
    var moreContentIgnoreItem = moreContentContainer.querySelectorAll('a.hide')[0];
    var mobileNavSubMenuContainer = mobileNavSubMenu.querySelectorAll('.menu')[0];
    var mobileNavSubMenuIgnoreItem = mobileNavSubMenuContainer.querySelectorAll('a.hide')[0];
    for (var i = 0; i < subMenu.length; i++) {
      var menuLevel1 = subMenu[i];
      var value = menuLevel1.value;
      var secondaryLevel1Item = secondaryLevel1.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(secondaryLevel1Item, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', indexLevel2),'indexLevel3', i), value);
      secondaryNavLinkContainer.insertBefore(secondaryLevel1Item, moreBtnContainer);

      var moreContentItem = moreContentIgnoreItem.cloneNode(true);
      setHTML(setAttribute(setAttribute(addClass(removeClass(moreContentItem, 'ignore'), 'copied'), 'key', value),'index', i), value);
      moreContentContainer.appendChild(moreContentItem);

      var mobileNavSubMenuItem = mobileNavSubMenuIgnoreItem.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(mobileNavSubMenuItem, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', indexLevel2),'indexLevel3', i), value);
      mobileNavSubMenuContainer.appendChild(mobileNavSubMenuItem);

      if (i === 0) {
        forceSecondaryLevel1Click(secondaryLevel1Item);
      }
    }

    checkForShrinkMore();
  }

  /**
   * clear secondary navigation mobile item
   */
  function clearSecondaryNavMobileItem() {
    removeItem(secondaryNavMobile.querySelectorAll('a.copied'));
  }

  /**
   * populate secondary navigation mobile item
   */
  function polulateSecondaryNavMobile(target) {
    clearSecondaryNavMobileItem();
    if (!target) {
      return;
    }

    var indexLevel1 = target.getAttribute('indexLevel1');
    var datas = navMenus[indexLevel1];
    var subMenu = datas.subMenu;
    if (!subMenu || !subMenu.length) {
      return;
    }

    // create secondary mobile menu
    var menu = secondaryNavMobile.querySelectorAll('.menu')[0];
    var secondaryLevel1 = menu.querySelectorAll('a.hide')[0];
    for (var i = 0; i < subMenu.length; i++) {
      var menuLevel1 = subMenu[i];
      var value = menuLevel1.value;
      var secondaryLevel1Item = secondaryLevel1.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(secondaryLevel1Item, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', i), value);
      menu.appendChild(secondaryLevel1Item);
    }
  }
  
  /**
   * logout user
   * @param {event for logout button click} event 
   */
  function logoutButtonClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'logout-btn')) return;

    removeClass(headerNavUi, "isLoggedIn");
    removeClass(document.getElementsByClassName('user-info-popup'), "isOpen");
    checkForShrinkMore();
  }

  /**
   * Animation for moving arrow to target
   * @param {offset x} offsetX 
   * @param {arror element} arrow 
   * @param {target element} element 
   */
  function moveArrowTo(offsetX, arrow, element) {
    var arrowOffset = offset(element);
    var arrowX = offsetX + arrowOffset.left + (element.offsetWidth - arrow.offsetWidth)/2;
    arrow.style.transform = "translate3d(" + arrowX + "px, 0, 0)";
  }

  /**
   * Login 
   * @param {click event} event 
   */
  function loginButtonClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'login-btn')) return;

    addClass(headerNavUi, "isLoggedIn");
    checkForShrinkMore();
  }
  
  /**
   * move primary arrow to target
   */
  function movePrimaryArrowTo(xOffset, target) {
    moveArrowTo(xOffset, arrowSelectedPrimaryAnimation, target);
  }

  /**
   * Update ui for clicked sublevel 1 item
   * @param {sublevel 1 item} target 
   */
  function forceClickToSublevel1(target) {
    if (!target) {
      return;
    }
  
    polulateSecondaryNavMobile(target);
    var classKey = target.getAttribute('key');
    removeClass(document.getElementsByClassName('primary-level-2-container'), "isOpen");
    removeClass(removeClass(primaryNav.getElementsByClassName('primary-level-1'), "isOpen"), "isOpenSubmenu");
    removeClass(primaryNav.querySelectorAll('.primary-level-2-container a'), "isOpen");

    var subList = target.nextElementSibling;
    while (subList && !hasClass(subList, 'primary-level-2-container')) {
      subList = subList.nextElementSibling;
    }
    addClass(subList, "isOpen");
    addClass(target, "isOpen");

    movePrimaryArrowTo(0, target);
    populateSecondaryNav();
    checkForShrinkMore();

    if (classKey !== 'MORE') {
      previousSelectElementDesktop = target;
      previousLevel2ItemSelectElement = null;
    }

    selectingLevel1ClassKey = classKey;

    addClass(mobileNavSubMenu, 'isNothing');
  }

  /**
   * submenu level 1 click
   * @param {click event} event 
   */
  function subLevel1Click(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'primary-level-1') || hasClass(target, 'login-btn') || hasClass(target, 'login-container')) return;

    forceClickToSublevel1(target);
    event.preventDefault();
  }

  /**
   * Update ui when click to sub level 2 item
   * @param {item sub level 2} target 
   */
  function forceClickToSubLevel2(target) {
    if (!target) {
      return;
    }
    
    var classKey = target.getAttribute('key');
    addClass(primaryNav.querySelectorAll('.primary-level-1.isOpen'), "isOpenSubmenu");
    var visibleMoreItemSelector = ".primary-level-2-container.isOpen .more-btn-container .more-content-container a:not(.hide)[key='" + classKey + "']";
    var visibleMoreItem = primaryNav.querySelectorAll(visibleMoreItemSelector);
    var secondaryNavMobileItemSelector = ".menu a.secondary-mobile-level-2[key='" + classKey + "']";
    var secondaryNavMobileItem = secondaryNavMobile.querySelectorAll(secondaryNavMobileItemSelector);
    removeClass(secondaryNavMobile.querySelectorAll('.menu a'), "isOpen");
    removeClass(primaryNav.querySelectorAll('.primary-level-2-container a'), "isOpen");
    var primaryLevel2 = primaryNav.querySelectorAll("a.primary-level-2[key='" + classKey + "']")[0];
    addClass(primaryLevel2, "isOpen");
    addClass(visibleMoreItem, "isOpen");
    addClass(secondaryNavMobileItem, "isOpen");
    mobileNavSubMenu.querySelectorAll('.header .name')[0].innerHTML = classKey;

    populateSecondaryNav(primaryLevel2, target);
    adjustSelectionPrimaryNavPosition(true);
    adjustSelectionSecondaryNavPosition(false);

    if (selectingLevel1ClassKey !== 'MORE') {
      previousLevel2ItemSelectElement = target;
    }
  }

  /**
   * event for sub level 2 more item click
   * @param {click event} event 
   */
  function subLevel2MoreClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'primary-level-2-more')) return;
    
    forceClickToSubLevel2(target);
    event.preventDefault();
  }

  /**
   * event for sub level 2 item click
   * @param {click event} event 
   */
  function subLevel2Click(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'primary-level-2')) return;
    
    forceClickToSubLevel2(target);
    event.preventDefault();
  }
  
  /**
   * event for sub level 2 mobile item click
   * @param {click event} event 
   */
  function subLevel2MobileClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'secondary-mobile-level-2')) return;
    
    forceClickToSubLevel2(target);
    event.preventDefault();

    removeClass(headerNavUi, 'isOpenSecondaryNavMobile');
  }
  
  /**
   * move secondary arrow to target
   */
  function moveSecondaryArrowTo(xOffset, target) {
    var arrowOffset = offset(secondaryNavLinkContainer);
    moveArrowTo(-arrowOffset.left + xOffset, arrowSelectedSecondaryAnimation, target);
  }

  /**
   * Update ui when secondary level 1 item click
   * @param {secondary level 1 item} target 
   */
  function forceSecondaryLevel1Click(target) {
    if (!target) {
      return;
    }

    removeClass(secondaryNavLinkContainer.getElementsByClassName('secondary-level-1'), "isOpen");
    removeClass(secondaryNavLinkContainer.getElementsByClassName('secondary-level-1-more'), "isOpen");
    removeClass(mobileNavSubMenu.querySelectorAll('.menu a'), "isOpen");
    var classKey = target.getAttribute('key');
    
    var secondaryLevel1Selector = "a.secondary-level-1[key='" + classKey + "']";
    var secondaryLevel1 = secondaryNavLinkContainer.querySelectorAll(secondaryLevel1Selector);
    var secondaryLevel1MoreSelector = "a.secondary-level-1-more[key='" + classKey + "']";
    var secondaryLevel1More = secondaryNavLinkContainer.querySelectorAll(secondaryLevel1MoreSelector);
    var mobileNavSubMenuItemSelector = ".menu a[key='" + classKey + "']";
    var mobileNavSubMenuItem = mobileNavSubMenu.querySelectorAll(mobileNavSubMenuItemSelector);

    addClass(secondaryLevel1, 'isOpen');
    addClass(secondaryLevel1More, 'isOpen');
    addClass(mobileNavSubMenuItem, 'isOpen');

    removeClass(arrowSelectedSecondaryAnimation, 'hide');
    adjustSelectionSecondaryNavPosition(true);
  }

  /**
   * secondary level 1 more item click
   * @param {click event} event 
   */
  function secondaryLevel1MoreClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'secondary-level-1-more')) return;
    
    forceSecondaryLevel1Click(target);
    event.preventDefault();
  }

  /**
   * secondary level 1 item click
   * @param {click event} event 
   */
  function secondaryLevel1Click(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'secondary-level-1') ) return;

    forceSecondaryLevel1Click(target);

    event.preventDefault();
  }

  /**
   * nav sub menu item click
   * @param {click event} event 
   */
  function mobileNavSubMenuItemClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'mobile-nav-sub-menu-item') ) return;

    removeClass(mobileNavSubMenu, 'isOpen');
    forceSecondaryLevel1Click(target);

    event.preventDefault();
  }
  
  /**
   * Show popup user info
   * @param {click event} event 
   */
  function userInfoContainerClick(event) {
    var isSelected = false;
    var target = event.target;
    if (!target) {
      return;
    }
    iterateElement(document.querySelectorAll('.user-info-container, .user-info-popup-mobile .icon-close'), function(el) {
      if (el.contains(target)) {
        isSelected = true;
      }
    });
    if (isSelected) {
      toggleClass(document.getElementsByClassName('user-info-popup'), "isOpen");
      event.preventDefault();
    } else {
      clickOutsideToClosePopupProfile(event);
    }
  }

  /**
   * click outside to hide popup user info
   * @param {click event} event 
   */
  function clickOutsideToClosePopupProfile(event) {
    var userInfoPopup = document.querySelectorAll('.header-nav-ui .primary-nav .user-info-popup')[0];
    if (!isHidden(userInfoPopup) && !userInfoPopup.contains(event.target)) {
      removeClass(userInfoPopup, 'isOpen');
    }
  }
  
  /**
   * more button click
   * @param {click event} event 
   */
  function moreButtonClick(event) {
    var moreBtnClicked = null;
    var target = event.target;
    if (!target) {
      return;
    }
    iterateElement(document.querySelectorAll('.more-btn'), function(el) {
      if (el.contains(target)) {
        moreBtnClicked = el;
      }
    });
    if (moreBtnClicked) {
      event.preventDefault();
      var isOpen = hasClass(moreBtnClicked.parentNode, "isOpen");
      iterateElement(headerNavUi.querySelectorAll('.more-btn'), function(el2){
        removeClass(el2.parentNode, "isOpen");
      });
      if (isOpen) {
        removeClass(moreBtnClicked.parentNode, "isOpen");
      } else {
        addClass(moreBtnClicked.parentNode, "isOpen");
        var moreContentContainer= moreBtnClicked.parentNode.getElementsByClassName('more-content-container')[0];
        var moreContentContainerOffset = offset(moreContentContainer);
        var rightExpandX =  window.innerWidth - (moreContentContainerOffset.left + moreContentContainer.offsetWidth);

        if (rightExpandX < 0) {
          moreContentContainer.style.marginLeft = (rightExpandX + "px");
        } else {
          moreContentContainer.style.marginLeft = "0";
        }
      }
    } else {
      clickOutsideToClosePopupMore(event);
    }
  }

  /**
   * click outside to hide more popup
   * @param {click event} event 
   */
  function clickOutsideToClosePopupMore(event) {
    iterateElement(document.querySelectorAll('.more-content-container'), function(userInfoPopup) {
      if (!isHidden(userInfoPopup) && !userInfoPopup.contains(event.target)) {
        removeClass(userInfoPopup.parentNode, 'isOpen');
      }
    });
  }

  /**
   * dont play secondary nav animation
   */
  function ignoreSelectionSecondaryNavAnimation() {
    removeClass(arrowSelectedSecondaryAnimation, 'isAnimation');
    setTimeout(function () {
      addClass(arrowSelectedSecondaryAnimation, 'isAnimation');
    }, 100);
  }

  /**
   * move secondary arrow animation
   * @param {is with animation} withAnimation 
   */
  function adjustSelectionSecondaryNavPosition(withAnimation) {
    if (withAnimation) {
      addClass(arrowSelectedSecondaryAnimation, 'isAnimation');
    } else {
      ignoreSelectionSecondaryNavAnimation();
    }
    var moreContainer = secondaryNavLinkContainer.getElementsByClassName('more-btn-container')[0];
    var secondaryLevel1IsOpen = secondaryNavLinkContainer.querySelectorAll('.secondary-level-1.isOpen');
    if (secondaryLevel1IsOpen.length > 0) {
      secondaryLevel1IsOpen = secondaryLevel1IsOpen[0];
      if (hasClass(secondaryLevel1IsOpen, 'hide')) {
        ignoreSelectionSecondaryNavAnimation();
        moveSecondaryArrowTo(-5, moreContainer);
      } else {
        moveSecondaryArrowTo(0, secondaryLevel1IsOpen);
      }
    }
  }

  /**
   * dont play primary nav animation
   */
  function ignoreSelectionPrimaryNavAnimation() {
    removeClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    setTimeout(function () {
      addClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    }, 10);
  }

  /**
   * move primary arrow animation
   * @param {is with animation} withAnimation 
   */
  function adjustSelectionPrimaryNavPosition(withAnimation) {
    if (withAnimation) {
      addClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    } else {
      ignoreSelectionPrimaryNavAnimation();
    }
    var primaryLevel2Container = primaryNav.querySelectorAll('.primary-level-2-container.isOpen');
    var primaryLevel1IsOpen = primaryNav.querySelectorAll('.primary-level-1.isOpen');
    if (primaryLevel2Container.length === 0 || isHidden(primaryLevel2Container[0])) {
      movePrimaryArrowTo(0, primaryLevel1IsOpen[0]);
      return;
    }

    var primaryLinkContainer = primaryLevel2Container[0];
    var moreContainer = primaryLinkContainer.getElementsByClassName('more-btn-container')[0];
    var primaryLevel2IsOpen = primaryLinkContainer.querySelectorAll('.primary-level-2.isOpen');
    if (primaryLevel2IsOpen.length > 0) {
      primaryLevel2IsOpen = primaryLevel2IsOpen[0];
      if (hasClass(primaryLevel2IsOpen, 'hide')) {
        ignoreSelectionPrimaryNavAnimation();
        movePrimaryArrowTo(-5, moreContainer);
      } else {
        movePrimaryArrowTo(0, primaryLevel2IsOpen);
      }
    } else if (primaryLevel1IsOpen.length > 0) {
      movePrimaryArrowTo(0, primaryLevel1IsOpen[0]);
    }
  }

  /**
   * check to shrink menu if it too long
   * @param {element} el 
   * @param {link class} linkClass 
   */
  function checkToShrinkElement(el, linkClass) {
    if (!el) {
      return;
    }
    var nextElement = el.nextElementSibling;
    while (nextElement && isHidden(nextElement)) {
      nextElement = nextElement.nextElementSibling;
    }
    var distance = getDistance(el, nextElement);
    var children = getTheClosestChild(el);
    var isChange = false;

    while (distance < spaceForShrinkMore) {
      var i = children.length - 1;
      for (; i >= 0; i--) {
        var primaryLevel2 = children[i];
        if (hasClass(primaryLevel2, linkClass) && !hasClass(primaryLevel2, 'hide') && !hasClass(primaryLevel2, 'icon-select') && !hasClass(primaryLevel2, 'ignore')) {
          addClass(primaryLevel2, 'hide');
          var moreContainer = el.getElementsByClassName('more-btn-container')[0];
          removeClass(moreContainer, 'hide');
          var classKey = primaryLevel2.getAttribute('key');
          var moreContentItem = removeClass(moreContainer.querySelectorAll(".more-content-container a[key='" + classKey + "']"), 'hide');
          if (hasClass(primaryLevel2, 'isOpen')) {
            addClass(moreContentItem, 'isOpen');
          }
          isChange = true;
          break;
        }
      }
      if (i >= 0) {
        distance = getDistance(el, nextElement);
      } else {
        break;
      }
    }

    if (isChange) {
      if (linkClass === 'secondary-level-1') {
        adjustSelectionSecondaryNavPosition(true);
      } else {
        adjustSelectionPrimaryNavPosition(true);
      }
    }
  }

  /**
   * check to expand menu if it have enough space
   * @param {element} el 
   * @param {link class} linkClass 
   */
  function expandElement(el, linkClass) {
    var children = getTheClosestChild(el);
    var moreContainer = el.getElementsByClassName('more-btn-container')[0];
    var i = children.length - 1;
    var isChange = false;
    for (var i = 0; i < children.length; i++) {
      var primaryLevel2 = children[i];
      if (hasClass(primaryLevel2, linkClass) && hasClass(primaryLevel2, 'hide') && !hasClass(primaryLevel2, 'ignore')) {
        removeClass(primaryLevel2, 'hide');
        var classKey = primaryLevel2.getAttribute('key');
        removeClass(addClass(moreContainer.querySelectorAll(".more-content-container a[key='" + classKey + "']"), 'hide'), 'isOpen');
        isChange = true;
        break;
      }
    }

    if (isChange) {
      if (linkClass === 'secondary-level-1') {
        adjustSelectionSecondaryNavPosition(true);
      } else {
        adjustSelectionPrimaryNavPosition(true);
      }
    }

    var activeElementInMore = moreContainer.querySelectorAll(".more-content-container a:not(.hide)");
    if (activeElementInMore.length === 0) {
      removeClass(addClass(moreContainer, 'hide'), 'isOpen');
    }
  }

  var previousScreenWidth = 0;
  /**
   * check to shrink/expand menu when window change size
   */
  function checkForShrinkMore() {
    var w = window.innerWidth;
    if (w <= 550 ) {
      if (w !== previousScreenWidth) {
        adjustSelectionPrimaryNavPosition(false);
      }
      previousScreenWidth = w;
      return;
    } else {

      removeClass(headerNavUi, 'isOpenSecondaryNavMobile');
      removeClass(mobileNavSubMenu, 'isOpen');
      // reselect element
      if (primaryNav.querySelectorAll('.primary-level-2-container.isOpen').length <= 0 && previousSelectElementDesktop) {
        var previousLevel2ItemSelectElementTmp = previousLevel2ItemSelectElement;
        forceClickToSublevel1(previousSelectElementDesktop);
        if (previousLevel2ItemSelectElementTmp) {
          forceClickToSubLevel2(previousLevel2ItemSelectElementTmp);
        }
      }
    }
    iterateElement(document.getElementsByClassName('primary-level-2-container'), function(el) {
      if (hasClass(el, 'isOpen')) {
        var nextElement = el.nextElementSibling;
        while (nextElement && isHidden(nextElement)) {
          nextElement = nextElement.nextElementSibling;
        }
        var distance = getDistance(el, nextElement);
        if (distance < spaceForShrinkMore) {
          checkToShrinkElement(el, 'primary-level-2');
        } else {
          expandElement(el, 'primary-level-2');
          checkToShrinkElement(el, 'primary-level-2');
        }
        if ((previousScreenWidth - 900) * (w - 900) <= 0) {
          adjustSelectionPrimaryNavPosition(false);
        }
      }
    });
    iterateElement(secondaryNavLinkContainer, function(el) {
      var distance = getDistance(el, el.nextElementSibling);
      if (distance < spaceForShrinkMore) {
        checkToShrinkElement(el, 'secondary-level-1');
      } else {
        expandElement(el, 'secondary-level-1');
        checkToShrinkElement(el, 'secondary-level-1');
      }
      if ((previousScreenWidth - 900) * (w - 900) <= 0) {
        adjustSelectionSecondaryNavPosition(false);
      }
    });
    previousScreenWidth = w;
  }

  // handle event window resize
  window.addEventListener("resize", function(){
    checkForShrinkMore();
  });
  
  checkForShrinkMore();
  setTimeout(function () {
    checkForShrinkMore();
    adjustSelectionPrimaryNavPosition(false);
    adjustSelectionSecondaryNavPosition(false);
  }, 100);
  
  headerNavUi.querySelectorAll('.mobile-nav .menu-btn')[0].addEventListener('click', function (event) {
    event.preventDefault();
    removeClass(mobileNavSubMenu, 'isOpen');
    addClass(headerNavUi, 'isOpenSecondaryNavMobile');
    adjustSelectionPrimaryNavPosition(false);
    setTimeout(function () {
      addClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    }, 100);
  }, false);
  
  headerNavUi.querySelectorAll('.mobile-nav .close-btn')[0].addEventListener('click', function (event) {
    event.preventDefault();
    removeClass(headerNavUi, 'isOpenSecondaryNavMobile');
  }, false);
  
  mobileNavSubMenu.getElementsByClassName('header')[0].addEventListener('click', function (event) {
    event.preventDefault();
    toggleClass(mobileNavSubMenu, 'isOpen');
  }, false);

  // handle click event
  document.addEventListener('click', function (event) {
    subLevel1Click(event);
    subLevel2Click(event);
    subLevel2MoreClick(event);
    subLevel2MobileClick(event);
    loginButtonClick(event);
    logoutButtonClick(event);
    secondaryLevel1Click(event);
    mobileNavSubMenuItemClick(event);
    secondaryLevel1MoreClick(event);
    userInfoContainerClick(event);
    moreButtonClick(event);
  }, false);
});

// example for navigation menu
var navMenus = [
  {
    value: 'BUSINESS',
    subMenu: [
      {
        value: "Solutions",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Enterprise Programs",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Customer Success",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Company",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Resources",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Blog",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
    ]
  },
  {
    value: 'WORK',
    subMenu: [
      {
        value: "Design",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Development",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Data Science",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "QA",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Topcoder Open",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      }
    ]
  },
  {
    value: 'MORE',
    subMenu: [
      {
        value: "About Topcoder",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Contact Us",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Carreers",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Terms & Conditions",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Social",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Press Kits",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Partner Programs",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
    ]
  }
];