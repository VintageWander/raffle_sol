/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/raffle_sol.json`.
 */
export type RaffleSol = {
  "address": "Gs123DKH46ckDb7gSvEizLcmDEcVqPmruZZw61grviqw",
  "metadata": {
    "name": "raffleSol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyTicket",
      "discriminator": [
        11,
        24,
        17,
        193,
        168,
        116,
        164,
        169
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "raffleState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  97,
                  110,
                  97,
                  45,
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claimPrize",
      "discriminator": [
        157,
        233,
        139,
        121,
        246,
        62,
        234,
        235
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "raffleState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  97,
                  110,
                  97,
                  45,
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "raffleState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  97,
                  110,
                  97,
                  45,
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
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
          "name": "start",
          "type": "u64"
        },
        {
          "name": "end",
          "type": "u64"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resetRaffle",
      "discriminator": [
        176,
        66,
        76,
        81,
        160,
        20,
        186,
        130
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "raffleState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  97,
                  110,
                  97,
                  45,
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "start",
          "type": "u64"
        },
        {
          "name": "end",
          "type": "u64"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "revealWinner",
      "discriminator": [
        234,
        209,
        237,
        109,
        16,
        196,
        64,
        254
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "raffleState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  97,
                  110,
                  97,
                  45,
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "raffleState",
      "discriminator": [
        160,
        186,
        30,
        174,
        174,
        156,
        156,
        244
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notAuthorized",
      "msg": "You're not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "raffleNotOpen",
      "msg": "Raffle is closed"
    },
    {
      "code": 6002,
      "name": "raffleOngoing",
      "msg": "Raffle is still ongoing"
    },
    {
      "code": 6003,
      "name": "winnerSelected",
      "msg": "Winner was already selected"
    },
    {
      "code": 6004,
      "name": "winnerNotSelected",
      "msg": "Winner has not been selected"
    },
    {
      "code": 6005,
      "name": "incorrectWinner",
      "msg": "Unfortunately, you're not the winner, try again next time!"
    }
  ],
  "types": [
    {
      "name": "raffleState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "end",
            "type": "u64"
          },
          {
            "name": "players",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "gameEnded",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
