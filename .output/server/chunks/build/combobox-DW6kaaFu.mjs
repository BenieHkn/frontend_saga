import { defineComponent, computed, ref, inject, watchEffect, nextTick, watch, provide, h, Fragment, toRaw, reactive, cloneVNode, unref, shallowRef, triggerRef, onScopeDispose } from 'vue';
import { d, e } from './form-DsUILy5F.mjs';
import { t as t$2, o as o$2 } from './active-element-history-Cer4cSOw.mjs';
import { i as i$1, o as o$1, A, T, u, E, N, a as o } from './keyboard-BCt0ZeLv.mjs';
import { w, n } from './use-outside-click-BqFFeIfQ.mjs';
import { s } from './use-resolve-button-type-CCTzT7JK.mjs';
import { u as u$1, i as i$4, c, f as f$1 } from './calculate-active-index-BN0T2bP2.mjs';
import { f, u as u$2 } from './hidden-e5tlhUcy.mjs';
import { l, i as i$3, t as t$1 } from './open-closed-DaveoKA1.mjs';
import { i as i$2, O } from './focus-management-CclPs0xY.mjs';

function memo(getDeps, fn, opts) {
  var _a;
  let deps = (_a = opts.initialDeps) != null ? _a : [];
  let result;
  let isInitial = true;
  function memoizedFunction() {
    var _a2, _b, _c;
    let depTime;
    if (opts.key && ((_a2 = opts.debug) == null ? void 0 : _a2.call(opts))) depTime = Date.now();
    const newDeps = getDeps();
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && ((_b = opts.debug) == null ? void 0 : _b.call(opts))) resultTime = Date.now();
    result = fn(...newDeps);
    if (opts.key && ((_c = opts.debug) == null ? void 0 : _c.call(opts))) {
      const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
      const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
      const resultFpsPercentage = resultEndTime / 16;
      const pad = (str, num) => {
        str = String(str);
        while (str.length < num) {
          str = " " + str;
        }
        return str;
      };
      console.info(
        `%c\u23F1 ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * resultFpsPercentage, 120)
        )}deg 100% 31%);`,
        opts == null ? void 0 : opts.key
      );
    }
    if ((opts == null ? void 0 : opts.onChange) && !(isInitial && opts.skipInitialOnChange)) {
      opts.onChange(result);
    }
    isInitial = false;
    return result;
  }
  memoizedFunction.updateDeps = (newDeps) => {
    deps = newDeps;
  };
  return memoizedFunction;
}
function notUndefined(value, msg) {
  if (value === void 0) {
    throw new Error(`Unexpected undefined${""}`);
  } else {
    return value;
  }
}
const approxEqual = (a, b) => Math.abs(a - b) < 1.01;
const debounce = (targetWindow, fn, ms) => {
  let timeoutId;
  return function(...args) {
    targetWindow.clearTimeout(timeoutId);
    timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
  };
};
const getRect = (element) => {
  const { offsetWidth, offsetHeight } = element;
  return { width: offsetWidth, height: offsetHeight };
};
const defaultKeyExtractor = (index) => index;
const defaultRangeExtractor = (range) => {
  const start = Math.max(range.startIndex - range.overscan, 0);
  const end = Math.min(range.endIndex + range.overscan, range.count - 1);
  const arr = [];
  for (let i2 = start; i2 <= end; i2++) {
    arr.push(i2);
  }
  return arr;
};
const observeElementRect = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  const handler = (rect) => {
    const { width, height } = rect;
    cb({ width: Math.round(width), height: Math.round(height) });
  };
  handler(getRect(element));
  if (!targetWindow.ResizeObserver) {
    return () => {
    };
  }
  const observer = new targetWindow.ResizeObserver((entries) => {
    const run = () => {
      const entry = entries[0];
      if (entry == null ? void 0 : entry.borderBoxSize) {
        const box = entry.borderBoxSize[0];
        if (box) {
          handler({ width: box.inlineSize, height: box.blockSize });
          return;
        }
      }
      handler(getRect(element));
    };
    instance.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
  });
  observer.observe(element, { box: "border-box" });
  return () => {
    observer.unobserve(element);
  };
};
const addEventListenerOptions = {
  passive: true
};
const supportsScrollend = true;
const observeElementOffset = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  let offset = 0;
  const fallback = instance.options.useScrollendEvent && supportsScrollend ? () => void 0 : debounce(
    targetWindow,
    () => {
      cb(offset, false);
    },
    instance.options.isScrollingResetDelay
  );
  const createHandler = (isScrolling) => () => {
    const { horizontal, isRtl } = instance.options;
    offset = horizontal ? element["scrollLeft"] * (isRtl && -1 || 1) : element["scrollTop"];
    fallback();
    cb(offset, isScrolling);
  };
  const handler = createHandler(true);
  const endHandler = createHandler(false);
  element.addEventListener("scroll", handler, addEventListenerOptions);
  const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend;
  if (registerScrollendEvent) {
    element.addEventListener("scrollend", endHandler, addEventListenerOptions);
  }
  return () => {
    element.removeEventListener("scroll", handler);
    if (registerScrollendEvent) {
      element.removeEventListener("scrollend", endHandler);
    }
  };
};
const measureElement = (element, entry, instance) => {
  if (entry == null ? void 0 : entry.borderBoxSize) {
    const box = entry.borderBoxSize[0];
    if (box) {
      const size = Math.round(
        box[instance.options.horizontal ? "inlineSize" : "blockSize"]
      );
      return size;
    }
  }
  return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
const elementScroll = (offset, {
  adjustments = 0,
  behavior
}, instance) => {
  var _a, _b;
  const toOffset = offset + adjustments;
  (_b = (_a = instance.scrollElement) == null ? void 0 : _a.scrollTo) == null ? void 0 : _b.call(_a, {
    [instance.options.horizontal ? "left" : "top"]: toOffset,
    behavior
  });
};
class Virtualizer {
  constructor(opts) {
    this.unsubs = [];
    this.scrollElement = null;
    this.targetWindow = null;
    this.isScrolling = false;
    this.currentScrollToIndex = null;
    this.measurementsCache = [];
    this.itemSizeCache = /* @__PURE__ */ new Map();
    this.laneAssignments = /* @__PURE__ */ new Map();
    this.pendingMeasuredCacheIndexes = [];
    this.prevLanes = void 0;
    this.lanesChangedFlag = false;
    this.lanesSettling = false;
    this.scrollRect = null;
    this.scrollOffset = null;
    this.scrollDirection = null;
    this.scrollAdjustments = 0;
    this.elementsCache = /* @__PURE__ */ new Map();
    this.observer = /* @__PURE__ */ (() => {
      let _ro = null;
      const get = () => {
        if (_ro) {
          return _ro;
        }
        if (!this.targetWindow || !this.targetWindow.ResizeObserver) {
          return null;
        }
        return _ro = new this.targetWindow.ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const run = () => {
              this._measureElement(entry.target, entry);
            };
            this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
          });
        });
      };
      return {
        disconnect: () => {
          var _a;
          (_a = get()) == null ? void 0 : _a.disconnect();
          _ro = null;
        },
        observe: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.observe(target, { box: "border-box" });
        },
        unobserve: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.unobserve(target);
        }
      };
    })();
    this.range = null;
    this.setOptions = (opts2) => {
      Object.entries(opts2).forEach(([key, value]) => {
        if (typeof value === "undefined") delete opts2[key];
      });
      this.options = {
        debug: false,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: false,
        getItemKey: defaultKeyExtractor,
        rangeExtractor: defaultRangeExtractor,
        onChange: () => {
        },
        measureElement,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: true,
        isRtl: false,
        useScrollendEvent: false,
        useAnimationFrameWithResizeObserver: false,
        ...opts2
      };
    };
    this.notify = (sync) => {
      var _a, _b;
      (_b = (_a = this.options).onChange) == null ? void 0 : _b.call(_a, this, sync);
    };
    this.maybeNotify = memo(
      () => {
        this.calculateRange();
        return [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ];
      },
      (isScrolling) => {
        this.notify(isScrolling);
      },
      {
        key: false,
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    );
    this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((d2) => d2());
      this.unsubs = [];
      this.observer.disconnect();
      this.scrollElement = null;
      this.targetWindow = null;
    };
    this._didMount = () => {
      return () => {
        this.cleanup();
      };
    };
    this._willUpdate = () => {
      var _a2;
      var _a;
      const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== scrollElement) {
        this.cleanup();
        if (!scrollElement) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = scrollElement;
        if (this.scrollElement && "ownerDocument" in this.scrollElement) {
          this.targetWindow = this.scrollElement.ownerDocument.defaultView;
        } else {
          this.targetWindow = (_a2 = (_a = this.scrollElement) == null ? void 0 : _a.window) != null ? _a2 : null;
        }
        this.elementsCache.forEach((cached) => {
          this.observer.observe(cached);
        });
        this.unsubs.push(
          this.options.observeElementRect(this, (rect) => {
            this.scrollRect = rect;
            this.maybeNotify();
          })
        );
        this.unsubs.push(
          this.options.observeElementOffset(this, (offset, isScrolling) => {
            this.scrollAdjustments = 0;
            this.scrollDirection = isScrolling ? this.getScrollOffset() < offset ? "forward" : "backward" : null;
            this.scrollOffset = offset;
            this.isScrolling = isScrolling;
            this.maybeNotify();
          })
        );
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    };
    this.getSize = () => {
      var _a;
      if (!this.options.enabled) {
        this.scrollRect = null;
        return 0;
      }
      this.scrollRect = (_a = this.scrollRect) != null ? _a : this.options.initialRect;
      return this.scrollRect[this.options.horizontal ? "width" : "height"];
    };
    this.getScrollOffset = () => {
      var _a;
      if (!this.options.enabled) {
        this.scrollOffset = null;
        return 0;
      }
      this.scrollOffset = (_a = this.scrollOffset) != null ? _a : typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset;
      return this.scrollOffset;
    };
    this.getFurthestMeasurement = (measurements, index) => {
      const furthestMeasurementsFound = /* @__PURE__ */ new Map();
      const furthestMeasurements = /* @__PURE__ */ new Map();
      for (let m = index - 1; m >= 0; m--) {
        const measurement = measurements[m];
        if (furthestMeasurementsFound.has(measurement.lane)) {
          continue;
        }
        const previousFurthestMeasurement = furthestMeasurements.get(
          measurement.lane
        );
        if (previousFurthestMeasurement == null || measurement.end > previousFurthestMeasurement.end) {
          furthestMeasurements.set(measurement.lane, measurement);
        } else if (measurement.end < previousFurthestMeasurement.end) {
          furthestMeasurementsFound.set(measurement.lane, true);
        }
        if (furthestMeasurementsFound.size === this.options.lanes) {
          break;
        }
      }
      return furthestMeasurements.size === this.options.lanes ? Array.from(furthestMeasurements.values()).sort((a, b) => {
        if (a.end === b.end) {
          return a.index - b.index;
        }
        return a.end - b.end;
      })[0] : void 0;
    };
    this.getMeasurementOptions = memo(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes
      ],
      (count, paddingStart, scrollMargin, getItemKey, enabled, lanes) => {
        const lanesChanged = this.prevLanes !== void 0 && this.prevLanes !== lanes;
        if (lanesChanged) {
          this.lanesChangedFlag = true;
        }
        this.prevLanes = lanes;
        this.pendingMeasuredCacheIndexes = [];
        return {
          count,
          paddingStart,
          scrollMargin,
          getItemKey,
          enabled,
          lanes
        };
      },
      {
        key: false
      }
    );
    this.getMeasurements = memo(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({ count, paddingStart, scrollMargin, getItemKey, enabled, lanes }, itemSizeCache) => {
        if (!enabled) {
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          return [];
        }
        if (this.laneAssignments.size > count) {
          for (const index of this.laneAssignments.keys()) {
            if (index >= count) {
              this.laneAssignments.delete(index);
            }
          }
        }
        if (this.lanesChangedFlag) {
          this.lanesChangedFlag = false;
          this.lanesSettling = true;
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          this.pendingMeasuredCacheIndexes = [];
        }
        if (this.measurementsCache.length === 0 && !this.lanesSettling) {
          this.measurementsCache = this.options.initialMeasurementsCache;
          this.measurementsCache.forEach((item) => {
            this.itemSizeCache.set(item.key, item.size);
          });
        }
        const min = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        if (this.lanesSettling && this.measurementsCache.length === count) {
          this.lanesSettling = false;
        }
        const measurements = this.measurementsCache.slice(0, min);
        const laneLastIndex = new Array(lanes).fill(
          void 0
        );
        for (let m = 0; m < min; m++) {
          const item = measurements[m];
          if (item) {
            laneLastIndex[item.lane] = m;
          }
        }
        for (let i2 = min; i2 < count; i2++) {
          const key = getItemKey(i2);
          const cachedLane = this.laneAssignments.get(i2);
          let lane;
          let start;
          if (cachedLane !== void 0 && this.options.lanes > 1) {
            lane = cachedLane;
            const prevIndex = laneLastIndex[lane];
            const prevInLane = prevIndex !== void 0 ? measurements[prevIndex] : void 0;
            start = prevInLane ? prevInLane.end + this.options.gap : paddingStart + scrollMargin;
          } else {
            const furthestMeasurement = this.options.lanes === 1 ? measurements[i2 - 1] : this.getFurthestMeasurement(measurements, i2);
            start = furthestMeasurement ? furthestMeasurement.end + this.options.gap : paddingStart + scrollMargin;
            lane = furthestMeasurement ? furthestMeasurement.lane : i2 % this.options.lanes;
            if (this.options.lanes > 1) {
              this.laneAssignments.set(i2, lane);
            }
          }
          const measuredSize = itemSizeCache.get(key);
          const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i2);
          const end = start + size;
          measurements[i2] = {
            index: i2,
            start,
            size,
            end,
            key,
            lane
          };
          laneLastIndex[lane] = i2;
        }
        this.measurementsCache = measurements;
        return measurements;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.calculateRange = memo(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (measurements, outerSize, scrollOffset, lanes) => {
        return this.range = measurements.length > 0 && outerSize > 0 ? calculateRange({
          measurements,
          outerSize,
          scrollOffset,
          lanes
        }) : null;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.getVirtualIndexes = memo(
      () => {
        let startIndex = null;
        let endIndex = null;
        const range = this.calculateRange();
        if (range) {
          startIndex = range.startIndex;
          endIndex = range.endIndex;
        }
        this.maybeNotify.updateDeps([this.isScrolling, startIndex, endIndex]);
        return [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          startIndex,
          endIndex
        ];
      },
      (rangeExtractor, overscan, count, startIndex, endIndex) => {
        return startIndex === null || endIndex === null ? [] : rangeExtractor({
          startIndex,
          endIndex,
          overscan,
          count
        });
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.indexFromElement = (node) => {
      const attributeName = this.options.indexAttribute;
      const indexStr = node.getAttribute(attributeName);
      if (!indexStr) {
        console.warn(
          `Missing attribute name '${attributeName}={index}' on measured element.`
        );
        return -1;
      }
      return parseInt(indexStr, 10);
    };
    this._measureElement = (node, entry) => {
      const index = this.indexFromElement(node);
      const item = this.measurementsCache[index];
      if (!item) {
        return;
      }
      const key = item.key;
      const prevNode = this.elementsCache.get(key);
      if (prevNode !== node) {
        if (prevNode) {
          this.observer.unobserve(prevNode);
        }
        this.observer.observe(node);
        this.elementsCache.set(key, node);
      }
      if (node.isConnected) {
        this.resizeItem(index, this.options.measureElement(node, entry, this));
      }
    };
    this.resizeItem = (index, size) => {
      var _a;
      const item = this.measurementsCache[index];
      if (!item) {
        return;
      }
      const itemSize = (_a = this.itemSizeCache.get(item.key)) != null ? _a : item.size;
      const delta = size - itemSize;
      if (delta !== 0) {
        if (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(item, delta, this) : item.start < this.getScrollOffset() + this.scrollAdjustments) {
          this._scrollToOffset(this.getScrollOffset(), {
            adjustments: this.scrollAdjustments += delta,
            behavior: void 0
          });
        }
        this.pendingMeasuredCacheIndexes.push(item.index);
        this.itemSizeCache = new Map(this.itemSizeCache.set(item.key, size));
        this.notify(false);
      }
    };
    this.measureElement = (node) => {
      if (!node) {
        this.elementsCache.forEach((cached, key) => {
          if (!cached.isConnected) {
            this.observer.unobserve(cached);
            this.elementsCache.delete(key);
          }
        });
        return;
      }
      this._measureElement(node, void 0);
    };
    this.getVirtualItems = memo(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (indexes, measurements) => {
        const virtualItems = [];
        for (let k = 0, len = indexes.length; k < len; k++) {
          const i2 = indexes[k];
          const measurement = measurements[i2];
          virtualItems.push(measurement);
        }
        return virtualItems;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.getVirtualItemForOffset = (offset) => {
      const measurements = this.getMeasurements();
      if (measurements.length === 0) {
        return void 0;
      }
      return notUndefined(
        measurements[findNearestBinarySearch(
          0,
          measurements.length - 1,
          (index) => notUndefined(measurements[index]).start,
          offset
        )]
      );
    };
    this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement) {
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      } else {
        const doc = this.scrollElement.document.documentElement;
        return this.options.horizontal ? doc.scrollWidth - this.scrollElement.innerWidth : doc.scrollHeight - this.scrollElement.innerHeight;
      }
    };
    this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
      if (!this.scrollElement) return 0;
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        align = toOffset >= scrollOffset + size ? "end" : "start";
      }
      if (align === "center") {
        toOffset += (itemSize - size) / 2;
      } else if (align === "end") {
        toOffset -= size;
      }
      const maxOffset = this.getMaxScrollOffset();
      return Math.max(Math.min(maxOffset, toOffset), 0);
    };
    this.getOffsetForIndex = (index, align = "auto") => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const item = this.measurementsCache[index];
      if (!item) {
        return void 0;
      }
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) {
          align = "end";
        } else if (item.start <= scrollOffset + this.options.scrollPaddingStart) {
          align = "start";
        } else {
          return [scrollOffset, align];
        }
      }
      if (align === "end" && index === this.options.count - 1) {
        return [this.getMaxScrollOffset(), align];
      }
      const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(toOffset, align, item.size),
        align
      ];
    };
    this.isDynamicMode = () => this.elementsCache.size > 0;
    this.scrollToOffset = (toOffset, { align = "start", behavior } = {}) => {
      if (behavior === "smooth" && this.isDynamicMode()) {
        console.warn(
          "The `smooth` scroll behavior is not fully supported with dynamic size."
        );
      }
      this._scrollToOffset(this.getOffsetForAlignment(toOffset, align), {
        adjustments: void 0,
        behavior
      });
    };
    this.scrollToIndex = (index, { align: initialAlign = "auto", behavior } = {}) => {
      if (behavior === "smooth" && this.isDynamicMode()) {
        console.warn(
          "The `smooth` scroll behavior is not fully supported with dynamic size."
        );
      }
      index = Math.max(0, Math.min(index, this.options.count - 1));
      this.currentScrollToIndex = index;
      let attempts = 0;
      const maxAttempts = 10;
      const tryScroll = (currentAlign) => {
        if (!this.targetWindow) return;
        const offsetInfo = this.getOffsetForIndex(index, currentAlign);
        if (!offsetInfo) {
          console.warn("Failed to get offset for index:", index);
          return;
        }
        const [offset, align] = offsetInfo;
        this._scrollToOffset(offset, { adjustments: void 0, behavior });
        this.targetWindow.requestAnimationFrame(() => {
          const verify = () => {
            if (this.currentScrollToIndex !== index) return;
            const currentOffset = this.getScrollOffset();
            const afterInfo = this.getOffsetForIndex(index, align);
            if (!afterInfo) {
              console.warn("Failed to get offset for index:", index);
              return;
            }
            if (!approxEqual(afterInfo[0], currentOffset)) {
              scheduleRetry(align);
            }
          };
          if (this.isDynamicMode()) {
            this.targetWindow.requestAnimationFrame(verify);
          } else {
            verify();
          }
        });
      };
      const scheduleRetry = (align) => {
        if (!this.targetWindow) return;
        if (this.currentScrollToIndex !== index) return;
        attempts++;
        if (attempts < maxAttempts) {
          this.targetWindow.requestAnimationFrame(() => tryScroll(align));
        } else {
          console.warn(
            `Failed to scroll to index ${index} after ${maxAttempts} attempts.`
          );
        }
      };
      tryScroll(initialAlign);
    };
    this.scrollBy = (delta, { behavior } = {}) => {
      if (behavior === "smooth" && this.isDynamicMode()) {
        console.warn(
          "The `smooth` scroll behavior is not fully supported with dynamic size."
        );
      }
      this._scrollToOffset(this.getScrollOffset() + delta, {
        adjustments: void 0,
        behavior
      });
    };
    this.getTotalSize = () => {
      var _a2;
      var _a;
      const measurements = this.getMeasurements();
      let end;
      if (measurements.length === 0) {
        end = this.options.paddingStart;
      } else if (this.options.lanes === 1) {
        end = (_a2 = (_a = measurements[measurements.length - 1]) == null ? void 0 : _a.end) != null ? _a2 : 0;
      } else {
        const endByLane = Array(this.options.lanes).fill(null);
        let endIndex = measurements.length - 1;
        while (endIndex >= 0 && endByLane.some((val) => val === null)) {
          const item = measurements[endIndex];
          if (endByLane[item.lane] === null) {
            endByLane[item.lane] = item.end;
          }
          endIndex--;
        }
        end = Math.max(...endByLane.filter((val) => val !== null));
      }
      return Math.max(
        end - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    };
    this._scrollToOffset = (offset, {
      adjustments,
      behavior
    }) => {
      this.options.scrollToFn(offset, { behavior, adjustments }, this);
    };
    this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map();
      this.laneAssignments = /* @__PURE__ */ new Map();
      this.notify(false);
    };
    this.setOptions(opts);
  }
}
const findNearestBinarySearch = (low, high, getCurrentValue, value) => {
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = getCurrentValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function calculateRange({
  measurements,
  outerSize,
  scrollOffset,
  lanes
}) {
  const lastIndex = measurements.length - 1;
  const getOffset = (index) => measurements[index].start;
  if (measurements.length <= lanes) {
    return {
      startIndex: 0,
      endIndex: lastIndex
    };
  }
  let startIndex = findNearestBinarySearch(
    0,
    lastIndex,
    getOffset,
    scrollOffset
  );
  let endIndex = startIndex;
  if (lanes === 1) {
    while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
      endIndex++;
    }
  } else if (lanes > 1) {
    const endPerLane = Array(lanes).fill(0);
    while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
      const item = measurements[endIndex];
      endPerLane[item.lane] = item.end;
      endIndex++;
    }
    const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
    while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
      const item = measurements[startIndex];
      startPerLane[item.lane] = item.start;
      startIndex--;
    }
    startIndex = Math.max(0, startIndex - startIndex % lanes);
    endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
  }
  return { startIndex, endIndex };
}
function useVirtualizerBase(options) {
  const virtualizer = new Virtualizer(unref(options));
  const state = shallowRef(virtualizer);
  const cleanup = virtualizer._didMount();
  watch(
    () => unref(options).getScrollElement(),
    (el) => {
      if (el) {
        virtualizer._willUpdate();
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => unref(options),
    (options2) => {
      virtualizer.setOptions({
        ...options2,
        onChange: (instance, sync) => {
          var _a;
          triggerRef(state);
          (_a = options2.onChange) == null ? void 0 : _a.call(options2, instance, sync);
        }
      });
      virtualizer._willUpdate();
      triggerRef(state);
    },
    {
      immediate: true
    }
  );
  onScopeDispose(cleanup);
  return state;
}
function useVirtualizer(options) {
  return useVirtualizerBase(
    computed(() => ({
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      ...unref(options)
    }))
  );
}
function i() {
  let o$12 = o$2();
  return o$12;
}
function t() {
  let e2 = i();
  return (o2) => {
    e2.dispose(), e2.nextFrame(o2);
  };
}
var g = ((f2) => (f2[f2.Left = 0] = "Left", f2[f2.Right = 2] = "Right", f2))(g || {});
function De(a, h2) {
  return a === h2;
}
var Ee = ((r) => (r[r.Open = 0] = "Open", r[r.Closed = 1] = "Closed", r))(Ee || {}), Ve = ((r) => (r[r.Single = 0] = "Single", r[r.Multi = 1] = "Multi", r))(Ve || {}), ke = ((y) => (y[y.Pointer = 0] = "Pointer", y[y.Focus = 1] = "Focus", y[y.Other = 2] = "Other", y))(ke || {});
let ne = /* @__PURE__ */ Symbol("ComboboxContext");
function K(a) {
  let h2 = inject(ne, null);
  if (h2 === null) {
    let r = new Error(`<${a} /> is missing a parent <Combobox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(r, K), r;
  }
  return h2;
}
let ie = /* @__PURE__ */ Symbol("VirtualContext"), Ae = defineComponent({ name: "VirtualProvider", setup(a, { slots: h$1 }) {
  let r = K("VirtualProvider"), y = computed(() => {
    let c2 = o$1(r.optionsRef);
    if (!c2) return { start: 0, end: 0 };
    let f2 = (void 0).getComputedStyle(c2);
    return { start: parseFloat(f2.paddingBlockStart || f2.paddingTop), end: parseFloat(f2.paddingBlockEnd || f2.paddingBottom) };
  }), o2 = useVirtualizer(computed(() => ({ scrollPaddingStart: y.value.start, scrollPaddingEnd: y.value.end, count: r.virtual.value.options.length, estimateSize() {
    return 40;
  }, getScrollElement() {
    return o$1(r.optionsRef);
  }, overscan: 12 }))), u2 = computed(() => {
    var c2;
    return (c2 = r.virtual.value) == null ? void 0 : c2.options;
  }), e2 = ref(0);
  return watch([u2], () => {
    e2.value += 1;
  }), provide(ie, r.virtual.value ? o2 : null), () => [h("div", { style: { position: "relative", width: "100%", height: `${o2.value.getTotalSize()}px` }, ref: (c2) => {
    if (c2) {
      if (typeof process != "undefined" && process.env.JEST_WORKER_ID !== void 0 || r.activationTrigger.value === 0) return;
      r.activeOptionIndex.value !== null && r.virtual.value.options.length > r.activeOptionIndex.value && o2.value.scrollToIndex(r.activeOptionIndex.value);
    }
  } }, o2.value.getVirtualItems().map((c2) => cloneVNode(h$1.default({ option: r.virtual.value.options[c2.index], open: r.comboboxState.value === 0 })[0], { key: `${e2.value}-${c2.index}`, "data-index": c2.index, "aria-setsize": r.virtual.value.options.length, "aria-posinset": c2.index + 1, style: { position: "absolute", top: 0, left: 0, transform: `translateY(${c2.start}px)`, overflowAnchor: "none" } })))];
} }), lt = defineComponent({ name: "Combobox", emits: { "update:modelValue": (a) => true }, props: { as: { type: [Object, String], default: "template" }, disabled: { type: [Boolean], default: false }, by: { type: [String, Function], nullable: true, default: null }, modelValue: { type: [Object, String, Number, Boolean], default: void 0 }, defaultValue: { type: [Object, String, Number, Boolean], default: void 0 }, form: { type: String, optional: true }, name: { type: String, optional: true }, nullable: { type: Boolean, default: false }, multiple: { type: [Boolean], default: false }, immediate: { type: [Boolean], default: false }, virtual: { type: Object, default: null } }, inheritAttrs: false, setup(a, { slots: h$1, attrs: r, emit: y }) {
  let o2 = ref(1), u2 = ref(null), e$1 = ref(null), c$1 = ref(null), f$2 = ref(null), S = ref({ static: false, hold: false }), v = ref([]), d$1 = ref(null), D = ref(2), E$1 = ref(false);
  function w$1(t2 = (n2) => n2) {
    let n2 = d$1.value !== null ? v.value[d$1.value] : null, s2 = t2(v.value.slice()), b = s2.length > 0 && s2[0].dataRef.order.value !== null ? s2.sort((C, A2) => C.dataRef.order.value - A2.dataRef.order.value) : O(s2, (C) => o$1(C.dataRef.domRef)), O$1 = n2 ? b.indexOf(n2) : null;
    return O$1 === -1 && (O$1 = null), { options: b, activeOptionIndex: O$1 };
  }
  let M = computed(() => a.multiple ? 1 : 0), $ = computed(() => a.nullable), [B, p] = d(computed(() => a.modelValue), (t2) => y("update:modelValue", t2), computed(() => a.defaultValue)), R = computed(() => B.value === void 0 ? u(M.value, { [1]: [], [0]: void 0 }) : B.value), V = null, i2 = null;
  function I(t2) {
    return u(M.value, { [0]() {
      return p == null ? void 0 : p(t2);
    }, [1]: () => {
      let n2 = toRaw(l2.value.value).slice(), s2 = toRaw(t2), b = n2.findIndex((O2) => l2.compare(s2, toRaw(O2)));
      return b === -1 ? n2.push(s2) : n2.splice(b, 1), p == null ? void 0 : p(n2);
    } });
  }
  let T$1 = computed(() => {
  });
  watch([T$1], ([t2], [n2]) => {
    if (l2.virtual.value && t2 && n2 && d$1.value !== null) {
      let s2 = t2.indexOf(n2[d$1.value]);
      s2 !== -1 ? d$1.value = s2 : d$1.value = null;
    }
  });
  let l2 = { comboboxState: o2, value: R, mode: M, compare(t2, n2) {
    if (typeof a.by == "string") {
      let s2 = a.by;
      return (t2 == null ? void 0 : t2[s2]) === (n2 == null ? void 0 : n2[s2]);
    }
    return a.by === null ? De(t2, n2) : a.by(t2, n2);
  }, calculateIndex(t2) {
    return l2.virtual.value ? a.by === null ? l2.virtual.value.options.indexOf(t2) : l2.virtual.value.options.findIndex((n2) => l2.compare(n2, t2)) : v.value.findIndex((n2) => l2.compare(n2.dataRef.value, t2));
  }, defaultValue: computed(() => a.defaultValue), nullable: $, immediate: computed(() => false), virtual: computed(() => null), inputRef: e$1, labelRef: u2, buttonRef: c$1, optionsRef: f$2, disabled: computed(() => a.disabled), options: v, change(t2) {
    p(t2);
  }, activeOptionIndex: computed(() => {
    if (E$1.value && d$1.value === null && (l2.virtual.value ? l2.virtual.value.options.length > 0 : v.value.length > 0)) {
      if (l2.virtual.value) {
        let n2 = l2.virtual.value.options.findIndex((s2) => {
          var b;
          return !((b = l2.virtual.value) != null && b.disabled(s2));
        });
        if (n2 !== -1) return n2;
      }
      let t2 = v.value.findIndex((n2) => !n2.dataRef.disabled);
      if (t2 !== -1) return t2;
    }
    return d$1.value;
  }), activationTrigger: D, optionsPropsRef: S, closeCombobox() {
    E$1.value = false, !a.disabled && o2.value !== 1 && (o2.value = 1, d$1.value = null);
  }, openCombobox() {
    if (E$1.value = true, !a.disabled && o2.value !== 0) {
      if (l2.value.value) {
        let t2 = l2.calculateIndex(l2.value.value);
        t2 !== -1 && (d$1.value = t2);
      }
      o2.value = 0;
    }
  }, setActivationTrigger(t2) {
    D.value = t2;
  }, goToOption(t2, n2, s2) {
    E$1.value = false, V !== null && cancelAnimationFrame(V), V = requestAnimationFrame(() => {
      if (a.disabled || f$2.value && !S.value.static && o2.value === 1) return;
      if (l2.virtual.value) {
        d$1.value = t2 === c.Specific ? n2 : f$1({ focus: t2 }, { resolveItems: () => l2.virtual.value.options, resolveActiveIndex: () => {
          var C, A2;
          return (A2 = (C = l2.activeOptionIndex.value) != null ? C : l2.virtual.value.options.findIndex((j) => {
            var q;
            return !((q = l2.virtual.value) != null && q.disabled(j));
          })) != null ? A2 : null;
        }, resolveDisabled: (C) => l2.virtual.value.disabled(C), resolveId() {
          throw new Error("Function not implemented.");
        } }), D.value = s2 != null ? s2 : 2;
        return;
      }
      let b = w$1();
      if (b.activeOptionIndex === null) {
        let C = b.options.findIndex((A2) => !A2.dataRef.disabled);
        C !== -1 && (b.activeOptionIndex = C);
      }
      let O2 = t2 === c.Specific ? n2 : f$1({ focus: t2 }, { resolveItems: () => b.options, resolveActiveIndex: () => b.activeOptionIndex, resolveId: (C) => C.id, resolveDisabled: (C) => C.dataRef.disabled });
      d$1.value = O2, D.value = s2 != null ? s2 : 2, v.value = b.options;
    });
  }, selectOption(t2) {
    let n2 = v.value.find((b) => b.id === t2);
    if (!n2) return;
    let { dataRef: s2 } = n2;
    I(s2.value);
  }, selectActiveOption() {
    if (l2.activeOptionIndex.value !== null) {
      if (l2.virtual.value) I(l2.virtual.value.options[l2.activeOptionIndex.value]);
      else {
        let { dataRef: t2 } = v.value[l2.activeOptionIndex.value];
        I(t2.value);
      }
      l2.goToOption(c.Specific, l2.activeOptionIndex.value);
    }
  }, registerOption(t2, n2) {
    let s2 = reactive({ id: t2, dataRef: n2 });
    if (l2.virtual.value) {
      v.value.push(s2);
      return;
    }
    i2 && cancelAnimationFrame(i2);
    let b = w$1((O2) => (O2.push(s2), O2));
    d$1.value === null && l2.isSelected(n2.value.value) && (b.activeOptionIndex = b.options.indexOf(s2)), v.value = b.options, d$1.value = b.activeOptionIndex, D.value = 2, b.options.some((O2) => !o$1(O2.dataRef.domRef)) && (i2 = requestAnimationFrame(() => {
      let O2 = w$1();
      v.value = O2.options, d$1.value = O2.activeOptionIndex;
    }));
  }, unregisterOption(t2, n2) {
    if (V !== null && cancelAnimationFrame(V), n2 && (E$1.value = true), l2.virtual.value) {
      v.value = v.value.filter((b) => b.id !== t2);
      return;
    }
    let s2 = w$1((b) => {
      let O2 = b.findIndex((C) => C.id === t2);
      return O2 !== -1 && b.splice(O2, 1), b;
    });
    v.value = s2.options, d$1.value = s2.activeOptionIndex, D.value = 2;
  }, isSelected(t2) {
    return u(M.value, { [0]: () => l2.compare(toRaw(l2.value.value), toRaw(t2)), [1]: () => toRaw(l2.value.value).some((n2) => l2.compare(toRaw(n2), toRaw(t2))) });
  }, isActive(t2) {
    return d$1.value === l2.calculateIndex(t2);
  } };
  w([e$1, c$1, f$2], () => l2.closeCombobox(), computed(() => o2.value === 0)), provide(ne, l2), t$1(computed(() => u(o2.value, { [0]: i$3.Open, [1]: i$3.Closed })));
  computed(() => {
    var t2;
    return (t2 = o$1(e$1)) == null ? void 0 : t2.closest("form");
  });
  return () => {
    var C, A$1, j;
    let { name: t2, disabled: n2, form: s2, ...b } = a, O2 = { open: o2.value === 0, disabled: n2, activeIndex: l2.activeOptionIndex.value, activeOption: l2.activeOptionIndex.value === null ? null : l2.virtual.value ? l2.virtual.value.options[(C = l2.activeOptionIndex.value) != null ? C : 0] : (j = (A$1 = l2.options.value[l2.activeOptionIndex.value]) == null ? void 0 : A$1.dataRef.value) != null ? j : null, value: R.value };
    return h(Fragment, [...t2 != null && R.value != null ? e({ [t2]: R.value }).map(([q, ue]) => h(f, E({ features: u$2.Hidden, key: q, as: "input", type: "hidden", hidden: true, readOnly: true, form: s2, disabled: n2, name: q, value: ue }))) : [], A({ theirProps: { ...r, ...T(b, ["by", "defaultValue", "immediate", "modelValue", "multiple", "nullable", "onUpdate:modelValue", "virtual"]) }, ourProps: {}, slot: O2, slots: h$1, attrs: r, name: "Combobox" })]);
  };
} });
defineComponent({ name: "ComboboxLabel", props: { as: { type: [Object, String], default: "label" }, id: { type: String, default: null } }, setup(a, { attrs: h2, slots: r }) {
  var e2;
  let y = (e2 = a.id) != null ? e2 : `headlessui-combobox-label-${i$1()}`, o2 = K("ComboboxLabel");
  function u2() {
    var c2;
    (c2 = o$1(o2.inputRef)) == null || c2.focus({ preventScroll: true });
  }
  return () => {
    let c2 = { open: o2.comboboxState.value === 0, disabled: o2.disabled.value }, { ...f2 } = a, S = { id: y, ref: o2.labelRef, onClick: u2 };
    return A({ ourProps: S, theirProps: f2, slot: c2, attrs: h2, slots: r, name: "ComboboxLabel" });
  };
} });
let nt = defineComponent({ name: "ComboboxButton", props: { as: { type: [Object, String], default: "button" }, id: { type: String, default: null } }, setup(a, { attrs: h2, slots: r, expose: y }) {
  var S;
  let o2 = (S = a.id) != null ? S : `headlessui-combobox-button-${i$1()}`, u2 = K("ComboboxButton");
  y({ el: u2.buttonRef, $el: u2.buttonRef });
  function e2(v) {
    u2.disabled.value || (u2.comboboxState.value === 0 ? u2.closeCombobox() : (v.preventDefault(), u2.openCombobox()), nextTick(() => {
      var d2;
      return (d2 = o$1(u2.inputRef)) == null ? void 0 : d2.focus({ preventScroll: true });
    }));
  }
  function c$1(v) {
    switch (v.key) {
      case o.ArrowDown:
        v.preventDefault(), v.stopPropagation(), u2.comboboxState.value === 1 && u2.openCombobox(), nextTick(() => {
          var d2;
          return (d2 = u2.inputRef.value) == null ? void 0 : d2.focus({ preventScroll: true });
        });
        return;
      case o.ArrowUp:
        v.preventDefault(), v.stopPropagation(), u2.comboboxState.value === 1 && (u2.openCombobox(), nextTick(() => {
          u2.value.value || u2.goToOption(c.Last);
        })), nextTick(() => {
          var d2;
          return (d2 = u2.inputRef.value) == null ? void 0 : d2.focus({ preventScroll: true });
        });
        return;
      case o.Escape:
        if (u2.comboboxState.value !== 0) return;
        v.preventDefault(), u2.optionsRef.value && !u2.optionsPropsRef.value.static && v.stopPropagation(), u2.closeCombobox(), nextTick(() => {
          var d2;
          return (d2 = u2.inputRef.value) == null ? void 0 : d2.focus({ preventScroll: true });
        });
        return;
    }
  }
  let f2 = s(computed(() => ({ as: a.as, type: h2.type })), u2.buttonRef);
  return () => {
    var E2, w2;
    let v = { open: u2.comboboxState.value === 0, disabled: u2.disabled.value, value: u2.value.value }, { ...d2 } = a, D = { ref: u2.buttonRef, id: o2, type: f2.value, tabindex: "-1", "aria-haspopup": "listbox", "aria-controls": (E2 = o$1(u2.optionsRef)) == null ? void 0 : E2.id, "aria-expanded": u2.comboboxState.value === 0, "aria-labelledby": u2.labelRef.value ? [(w2 = o$1(u2.labelRef)) == null ? void 0 : w2.id, o2].join(" ") : void 0, disabled: u2.disabled.value === true ? true : void 0, onKeydown: c$1, onClick: e2 };
    return A({ ourProps: D, theirProps: d2, slot: v, attrs: h2, slots: r, name: "ComboboxButton" });
  };
} }), it = defineComponent({ name: "ComboboxInput", props: { as: { type: [Object, String], default: "input" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, displayValue: { type: Function }, defaultValue: { type: String, default: void 0 }, id: { type: String, default: null } }, emits: { change: (a) => true }, setup(a, { emit: h2, attrs: r, slots: y, expose: o$3 }) {
  var V;
  let u2 = (V = a.id) != null ? V : `headlessui-combobox-input-${i$1()}`, e2 = K("ComboboxInput");
  computed(() => i$2(o$1(e2.inputRef)));
  o$3({ el: e2.inputRef, $el: e2.inputRef });
  function S() {
    e2.change(null);
    let i2 = o$1(e2.optionsRef);
    i2 && (i2.scrollTop = 0), e2.goToOption(c.Nothing);
  }
  computed(() => {
    var I;
    let i2 = e2.value.value;
    return o$1(e2.inputRef) ? typeof a.displayValue != "undefined" && i2 !== void 0 ? (I = a.displayValue(i2)) != null ? I : "" : typeof i2 == "string" ? i2 : "" : "";
  });
  let d2 = ref(false);
  function D() {
    d2.value = true;
  }
  function E2() {
    o$2().nextFrame(() => {
      d2.value = false;
    });
  }
  let w2 = t();
  function M(i2) {
    switch (w2(() => {
    }), i2.key) {
      case o.Enter:
        if (e2.comboboxState.value !== 0 || d2.value) return;
        if (i2.preventDefault(), i2.stopPropagation(), e2.activeOptionIndex.value === null) {
          e2.closeCombobox();
          return;
        }
        e2.selectActiveOption(), e2.mode.value === 0 && e2.closeCombobox();
        break;
      case o.ArrowDown:
        return i2.preventDefault(), i2.stopPropagation(), u(e2.comboboxState.value, { [0]: () => e2.goToOption(c.Next), [1]: () => e2.openCombobox() });
      case o.ArrowUp:
        return i2.preventDefault(), i2.stopPropagation(), u(e2.comboboxState.value, { [0]: () => e2.goToOption(c.Previous), [1]: () => {
          e2.openCombobox(), nextTick(() => {
            e2.value.value || e2.goToOption(c.Last);
          });
        } });
      case o.Home:
        if (i2.shiftKey) break;
        return i2.preventDefault(), i2.stopPropagation(), e2.goToOption(c.First);
      case o.PageUp:
        return i2.preventDefault(), i2.stopPropagation(), e2.goToOption(c.First);
      case o.End:
        if (i2.shiftKey) break;
        return i2.preventDefault(), i2.stopPropagation(), e2.goToOption(c.Last);
      case o.PageDown:
        return i2.preventDefault(), i2.stopPropagation(), e2.goToOption(c.Last);
      case o.Escape:
        if (e2.comboboxState.value !== 0) return;
        i2.preventDefault(), e2.optionsRef.value && !e2.optionsPropsRef.value.static && i2.stopPropagation(), e2.nullable.value && e2.mode.value === 0 && e2.value.value === null && S(), e2.closeCombobox();
        break;
      case o.Tab:
        if (e2.comboboxState.value !== 0) return;
        e2.mode.value === 0 && e2.activationTrigger.value !== 1 && e2.selectActiveOption(), e2.closeCombobox();
        break;
    }
  }
  function $(i2) {
    h2("change", i2), e2.nullable.value && e2.mode.value === 0 && i2.target.value === "" && S(), e2.openCombobox();
  }
  function B(i2) {
    var T2, l2, g2;
    let I = (T2 = i2.relatedTarget) != null ? T2 : t$2.find((t2) => t2 !== i2.currentTarget);
    if (!((l2 = o$1(e2.optionsRef)) != null && l2.contains(I)) && !((g2 = o$1(e2.buttonRef)) != null && g2.contains(I)) && e2.comboboxState.value === 0) return i2.preventDefault(), e2.mode.value === 0 && (e2.nullable.value && e2.value.value === null ? S() : e2.activationTrigger.value !== 1 && e2.selectActiveOption()), e2.closeCombobox();
  }
  function p(i2) {
    var T2, l2, g2;
    let I = (T2 = i2.relatedTarget) != null ? T2 : t$2.find((t2) => t2 !== i2.currentTarget);
    (l2 = o$1(e2.buttonRef)) != null && l2.contains(I) || (g2 = o$1(e2.optionsRef)) != null && g2.contains(I) || e2.disabled.value || e2.immediate.value && e2.comboboxState.value !== 0 && (e2.openCombobox(), o$2().nextFrame(() => {
      e2.setActivationTrigger(1);
    }));
  }
  let R = computed(() => {
    var i2, I, T2, l2;
    return (l2 = (T2 = (I = a.defaultValue) != null ? I : e2.defaultValue.value !== void 0 ? (i2 = a.displayValue) == null ? void 0 : i2.call(a, e2.defaultValue.value) : null) != null ? T2 : e2.defaultValue.value) != null ? l2 : "";
  });
  return () => {
    var t2, n2, s2, b, O2, C, A$1;
    let i2 = { open: e2.comboboxState.value === 0 }, { displayValue: I, onChange: T2, ...l2 } = a, g2 = { "aria-controls": (t2 = e2.optionsRef.value) == null ? void 0 : t2.id, "aria-expanded": e2.comboboxState.value === 0, "aria-activedescendant": e2.activeOptionIndex.value === null ? void 0 : e2.virtual.value ? (n2 = e2.options.value.find((j) => !e2.virtual.value.disabled(j.dataRef.value) && e2.compare(j.dataRef.value, e2.virtual.value.options[e2.activeOptionIndex.value]))) == null ? void 0 : n2.id : (s2 = e2.options.value[e2.activeOptionIndex.value]) == null ? void 0 : s2.id, "aria-labelledby": (C = (b = o$1(e2.labelRef)) == null ? void 0 : b.id) != null ? C : (O2 = o$1(e2.buttonRef)) == null ? void 0 : O2.id, "aria-autocomplete": "list", id: u2, onCompositionstart: D, onCompositionend: E2, onKeydown: M, onInput: $, onFocus: p, onBlur: B, role: "combobox", type: (A$1 = r.type) != null ? A$1 : "text", tabIndex: 0, ref: e2.inputRef, defaultValue: R.value, disabled: e2.disabled.value === true ? true : void 0 };
    return A({ ourProps: g2, theirProps: l2, slot: i2, attrs: r, slots: y, features: N.RenderStrategy | N.Static, name: "ComboboxInput" });
  };
} }), ut = defineComponent({ name: "ComboboxOptions", props: { as: { type: [Object, String], default: "ul" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, hold: { type: [Boolean], default: false } }, setup(a, { attrs: h$1, slots: r, expose: y }) {
  let o2 = K("ComboboxOptions"), u2 = `headlessui-combobox-options-${i$1()}`;
  y({ el: o2.optionsRef, $el: o2.optionsRef }), watchEffect(() => {
    o2.optionsPropsRef.value.static = a.static;
  }), watchEffect(() => {
    o2.optionsPropsRef.value.hold = a.hold;
  });
  let e2 = l(), c2 = computed(() => e2 !== null ? (e2.value & i$3.Open) === i$3.Open : o2.comboboxState.value === 0);
  i$4({ container: computed(() => o$1(o2.optionsRef)), enabled: computed(() => o2.comboboxState.value === 0), accept(S) {
    return S.getAttribute("role") === "option" ? NodeFilter.FILTER_REJECT : S.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(S) {
    S.setAttribute("role", "none");
  } });
  function f2(S) {
    S.preventDefault();
  }
  return () => {
    var D, E2, w2;
    let S = { open: o2.comboboxState.value === 0 }, v = { "aria-labelledby": (w2 = (D = o$1(o2.labelRef)) == null ? void 0 : D.id) != null ? w2 : (E2 = o$1(o2.buttonRef)) == null ? void 0 : E2.id, id: u2, ref: o2.optionsRef, role: "listbox", "aria-multiselectable": o2.mode.value === 1 ? true : void 0, onMousedown: f2 }, d2 = T(a, ["hold"]);
    return A({ ourProps: v, theirProps: d2, slot: S, attrs: h$1, slots: o2.virtual.value && o2.comboboxState.value === 0 ? { ...r, default: () => [h(Ae, {}, r.default)] } : r, features: N.RenderStrategy | N.Static, visible: c2.value, name: "ComboboxOptions" });
  };
} }), rt = defineComponent({ name: "ComboboxOption", props: { as: { type: [Object, String], default: "li" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false }, order: { type: [Number], default: null } }, setup(a, { slots: h2, attrs: r, expose: y }) {
  let o2 = K("ComboboxOption"), u$12 = `headlessui-combobox-option-${i$1()}`, e2 = ref(null), c$1 = computed(() => a.disabled);
  y({ el: e2, $el: e2 });
  let f2 = computed(() => {
    var p;
    return o2.virtual.value ? o2.activeOptionIndex.value === o2.calculateIndex(a.value) : o2.activeOptionIndex.value === null ? false : ((p = o2.options.value[o2.activeOptionIndex.value]) == null ? void 0 : p.id) === u$12;
  }), S = computed(() => o2.isSelected(a.value)), v = inject(ie, null);
  computed(() => ({ disabled: a.disabled, value: a.value, domRef: e2, order: computed(() => a.order) }));
  watchEffect(() => {
    let p = o$1(e2);
    p && (v == null || v.value.measureElement(p));
  }), watchEffect(() => {
    o2.comboboxState.value === 0 && f2.value && (o2.virtual.value || o2.activationTrigger.value !== 0 && nextTick(() => {
      var p, R;
      return (R = (p = o$1(e2)) == null ? void 0 : p.scrollIntoView) == null ? void 0 : R.call(p, { block: "nearest" });
    }));
  });
  function D(p) {
    p.preventDefault(), p.button === g.Left && (c$1.value || (o2.selectOption(u$12), n() || requestAnimationFrame(() => {
      var R;
      return (R = o$1(o2.inputRef)) == null ? void 0 : R.focus({ preventScroll: true });
    }), o2.mode.value === 0 && o2.closeCombobox()));
  }
  function E2() {
    var R;
    if (a.disabled || (R = o2.virtual.value) != null && R.disabled(a.value)) return o2.goToOption(c.Nothing);
    let p = o2.calculateIndex(a.value);
    o2.goToOption(c.Specific, p);
  }
  let w2 = u$1();
  function M(p) {
    w2.update(p);
  }
  function $(p) {
    var V;
    if (!w2.wasMoved(p) || a.disabled || (V = o2.virtual.value) != null && V.disabled(a.value) || f2.value) return;
    let R = o2.calculateIndex(a.value);
    o2.goToOption(c.Specific, R, 0);
  }
  function B(p) {
    var R;
    w2.wasMoved(p) && (a.disabled || (R = o2.virtual.value) != null && R.disabled(a.value) || f2.value && (o2.optionsPropsRef.value.hold || o2.goToOption(c.Nothing)));
  }
  return () => {
    let { disabled: p } = a, R = { active: f2.value, selected: S.value, disabled: p }, V = { id: u$12, ref: e2, role: "option", tabIndex: p === true ? void 0 : -1, "aria-disabled": p === true ? true : void 0, "aria-selected": S.value, disabled: void 0, onMousedown: D, onFocus: E2, onPointerenter: M, onMouseenter: M, onPointermove: $, onMousemove: $, onPointerleave: B, onMouseleave: B }, i2 = T(a, ["order", "value"]);
    return A({ ourProps: V, theirProps: i2, slot: R, attrs: r, slots: h2, name: "ComboboxOption" });
  };
} });

export { it as i, lt as l, nt as n, rt as r, ut as u };
//# sourceMappingURL=combobox-DW6kaaFu.mjs.map
