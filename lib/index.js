"use strict";

const { printAlyaBanner } = require("./Utils/banner");

// Display luxury ASCII banner with dynamic random colors on restart
printAlyaBanner();

const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              let desc = Object.getOwnPropertyDescriptor(m, k);
              if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });

const __exportStar =
    (this && this.__exportStar) ||
    function (m, exports) {
        for (var p in m) {
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) {
                __createBinding(exports, m, p);
            }
        }
    };

Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = exports.makeWASocket = null;

const { proto: proto } = require("../WAProto");
Object.defineProperty(exports, "proto", {
    enumerable: true,
    get: function () {
        return proto;
    },
});

const { default: socket } = require("./Socket");
exports.makeWASocket = socket;

// Export all original Baileys modules
__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

// Export latest interactive features
const Builder = require("./Builder");
__exportStar(Builder, exports);

// Export Telegram Bot & Bridge features
const Telegram = require("./Telegram");
__exportStar(Telegram, exports);

// Export banner tools
exports.printAlyaBanner = printAlyaBanner;

exports.default = socket;
module.exports = socket;
Object.assign(module.exports, exports);
