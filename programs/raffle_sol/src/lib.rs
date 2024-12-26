mod consts;
mod error;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Gs123DKH46ckDb7gSvEizLcmDEcVqPmruZZw61grviqw");

#[program]
pub mod raffle_sol {
    use super::*;

    pub fn init(context: Context<Init>, start: u64, end: u64, ticket_price: u64) -> Result<()> {
        instructions::init(context, start, end, ticket_price)
    }

    pub fn buy_ticket(context: Context<BuyTicket>) -> Result<()> {
        instructions::buy_ticket(context)
    }

    pub fn reveal_winner(context: Context<RevealWinner>) -> Result<()> {
        instructions::reveal_winner(context)
    }

    pub fn claim_prize(context: Context<ClaimPrize>) -> Result<()> {
        instructions::claim_prize(context)
    }

    pub fn reset_raffle(
        context: Context<ResetRaffle>,
        start: u64,
        end: u64,
        ticket_price: u64,
    ) -> Result<()> {
        instructions::reset_raffle(context, start, end, ticket_price)
    }
}
