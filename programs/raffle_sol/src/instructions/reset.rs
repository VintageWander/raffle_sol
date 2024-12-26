use anchor_lang::prelude::*;

use crate::{consts::SOLANA_RAFFLE, error::CustomError, state::RaffleState};

#[derive(Accounts)]
pub struct ResetRaffle<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [SOLANA_RAFFLE],
        bump = raffle_state.bump
    )]
    pub raffle_state: Account<'info, RaffleState>,
}
// This function is nearly identical to the `init` one, however it does not reset the authority or the bump
// It basically just resets the game state to the initial values
pub fn reset_raffle(
    Context {
        accounts: ResetRaffle {
            payer,
            raffle_state,
        },
        ..
    }: Context<ResetRaffle>,
    start: u64,
    end: u64,
    ticket_price: u64,
) -> Result<()> {
    if payer.key() != raffle_state.authority || !raffle_state.game_ended {
        return Err(error!(CustomError::NotAuthorized));
    }
    raffle_state.start = start;
    raffle_state.end = end;
    raffle_state.players.clear();
    raffle_state.ticket_price = ticket_price;
    raffle_state.winner = None;
    raffle_state.game_ended = false;
    Ok(())
}
