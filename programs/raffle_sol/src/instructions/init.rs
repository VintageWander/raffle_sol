use anchor_lang::prelude::*;

use crate::{consts::SOLANA_RAFFLE, state::RaffleState};

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init, payer = payer, space = RaffleState::SIZE, seeds = [SOLANA_RAFFLE], bump
    )]
    pub raffle_state: Account<'info, RaffleState>,

    pub system_program: Program<'info, System>,
}

pub fn init(
    Context {
        accounts: Init {
            payer,
            raffle_state,
            ..
        },
        bumps,
        ..
    }: Context<Init>,
    start: u64,
    end: u64,
    ticket_price: u64,
) -> Result<()> {
    raffle_state.authority = payer.key();
    raffle_state.bump = bumps.raffle_state;
    raffle_state.start = start;
    raffle_state.end = end;
    raffle_state.players.clear();
    raffle_state.ticket_price = ticket_price;
    raffle_state.winner = None;
    raffle_state.game_ended = false;

    Ok(())
}
