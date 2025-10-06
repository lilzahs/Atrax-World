/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/atrax.json`.
 */
export type Atrax = {
  "address": "35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC",
  "metadata": {
    "name": "atrax",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyItem",
      "discriminator": [
        80,
        82,
        193,
        201,
        216,
        27,
        70,
        184
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "devWallet",
          "writable": true
        },
        {
          "name": "config"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "itemId",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "choosePiece",
      "discriminator": [
        30,
        228,
        132,
        255,
        245,
        54,
        193,
        148
      ],
      "accounts": [
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "roomSettings",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "roomId"
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "streamer",
          "writable": true
        },
        {
          "name": "devWallet",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "roomId",
          "type": "u32"
        },
        {
          "name": "pieceType",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimProfit",
      "discriminator": [
        234,
        73,
        53,
        22,
        182,
        46,
        83,
        104
      ],
      "accounts": [
        {
          "name": "claimer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRoom",
      "discriminator": [
        62,
        51,
        97,
        121,
        144,
        160,
        43,
        85
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "roomId"
              }
            ]
          }
        },
        {
          "name": "streamer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "roomId",
          "type": "u32"
        },
        {
          "name": "roomName",
          "type": "string"
        },
        {
          "name": "streamUrl",
          "type": "string"
        }
      ]
    },
    {
      "name": "donate",
      "discriminator": [
        121,
        186,
        218,
        211,
        73,
        70,
        196,
        180
      ],
      "accounts": [
        {
          "name": "donor",
          "writable": true,
          "signer": true
        },
        {
          "name": "streamer",
          "writable": true
        },
        {
          "name": "devWallet",
          "writable": true
        },
        {
          "name": "config"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "devWallet",
          "type": "pubkey"
        },
        {
          "name": "feeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initializeLand",
      "discriminator": [
        62,
        119,
        73,
        238,
        255,
        58,
        72,
        167
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "land",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "landId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeRoomSettings",
      "discriminator": [
        238,
        66,
        98,
        15,
        39,
        151,
        11,
        230
      ],
      "accounts": [
        {
          "name": "roomSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "piecePrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "tradeItem",
      "discriminator": [
        43,
        1,
        67,
        54,
        163,
        119,
        21,
        100
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "seller",
          "writable": true
        },
        {
          "name": "devWallet",
          "writable": true
        },
        {
          "name": "config"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "itemId",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferLand",
      "discriminator": [
        83,
        16,
        230,
        202,
        65,
        32,
        41,
        73
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "land",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "landId",
          "type": "u64"
        },
        {
          "name": "newOwner",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateAdmin",
      "discriminator": [
        161,
        176,
        40,
        213,
        60,
        184,
        179,
        228
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "config"
          ]
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "config"
          ]
        }
      ],
      "args": [
        {
          "name": "newDevWallet",
          "type": "pubkey"
        },
        {
          "name": "newFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateRoomSettings",
      "discriminator": [
        251,
        172,
        220,
        119,
        59,
        238,
        106,
        191
      ],
      "accounts": [
        {
          "name": "roomSettings",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  95,
                  115,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "roomSettings"
          ]
        }
      ],
      "args": [
        {
          "name": "newPiecePrice",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "landAccount",
      "discriminator": [
        22,
        117,
        128,
        89,
        2,
        71,
        202,
        215
      ]
    },
    {
      "name": "room",
      "discriminator": [
        156,
        199,
        67,
        27,
        222,
        23,
        185,
        94
      ]
    },
    {
      "name": "roomSettings",
      "discriminator": [
        206,
        71,
        196,
        176,
        144,
        39,
        77,
        69
      ]
    }
  ],
  "events": [
    {
      "name": "adminUpdated",
      "discriminator": [
        69,
        82,
        49,
        171,
        43,
        3,
        80,
        161
      ]
    },
    {
      "name": "configInitialized",
      "discriminator": [
        181,
        49,
        200,
        156,
        19,
        167,
        178,
        91
      ]
    },
    {
      "name": "configUpdated",
      "discriminator": [
        40,
        241,
        230,
        122,
        11,
        19,
        198,
        194
      ]
    },
    {
      "name": "donationEvent",
      "discriminator": [
        43,
        125,
        2,
        48,
        193,
        140,
        25,
        191
      ]
    },
    {
      "name": "landTransferEvent",
      "discriminator": [
        25,
        233,
        161,
        130,
        24,
        3,
        59,
        189
      ]
    },
    {
      "name": "pieceChosen",
      "discriminator": [
        17,
        146,
        233,
        143,
        168,
        75,
        44,
        136
      ]
    },
    {
      "name": "roomClaimed",
      "discriminator": [
        157,
        177,
        246,
        94,
        16,
        121,
        129,
        66
      ]
    },
    {
      "name": "shopPurchaseEvent",
      "discriminator": [
        33,
        165,
        50,
        113,
        86,
        211,
        70,
        130
      ]
    },
    {
      "name": "tradeEvent",
      "discriminator": [
        189,
        219,
        127,
        211,
        78,
        230,
        97,
        238
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAmount",
      "msg": "Amount must be greater than zero"
    },
    {
      "code": 6001,
      "name": "feeTooHigh",
      "msg": "Fee exceeds 100% (10000 bps)"
    },
    {
      "code": 6002,
      "name": "invalidDevWallet",
      "msg": "Invalid developer wallet provided"
    },
    {
      "code": 6003,
      "name": "unauthorized",
      "msg": "Unauthorized action"
    },
    {
      "code": 6004,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6005,
      "name": "landNotInitialized",
      "msg": "Land account is not initialized"
    },
    {
      "code": 6006,
      "name": "invalidLandId",
      "msg": "Provided land id does not match record"
    },
    {
      "code": 6007,
      "name": "invalidRoomId",
      "msg": "Invalid room id"
    },
    {
      "code": 6008,
      "name": "roomNameTooLong",
      "msg": "Room name too long (max 50)"
    },
    {
      "code": 6009,
      "name": "streamUrlTooLong",
      "msg": "Stream URL too long (max 200)"
    },
    {
      "code": 6010,
      "name": "invalidPieceType",
      "msg": "Invalid piece type (0..6)"
    },
    {
      "code": 6011,
      "name": "roomNotExpired",
      "msg": "Room is not expired yet"
    },
    {
      "code": 6012,
      "name": "invalidStreamer",
      "msg": "Invalid streamer wallet for room"
    }
  ],
  "types": [
    {
      "name": "adminUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAdmin",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "devWallet",
            "type": "pubkey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "configInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "devWallet",
            "type": "pubkey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "configUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "devWallet",
            "type": "pubkey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "donationEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donor",
            "type": "pubkey"
          },
          {
            "name": "streamer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "feeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "landAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "landId",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "initialized",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "landTransferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "landId",
            "type": "u64"
          },
          {
            "name": "newOwner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "pieceChosen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "roomId",
            "type": "u32"
          },
          {
            "name": "pieceType",
            "type": "u8"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "room",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "roomName",
            "type": "string"
          },
          {
            "name": "streamUrl",
            "type": "string"
          },
          {
            "name": "playerWallet",
            "type": "pubkey"
          },
          {
            "name": "latestChosenPiece",
            "type": "u8"
          },
          {
            "name": "lastBuyer",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "roomClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "roomId",
            "type": "u32"
          },
          {
            "name": "streamer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "roomSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "piecePrice",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "shopPurchaseEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tradeEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
