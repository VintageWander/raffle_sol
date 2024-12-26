use anchor_lang::prelude::*;

use crate::{
    consts::{MAX_PLAYERS, SOLANA_RAFFLE},
    error::CustomError,
    state::RaffleState,
};

#[derive(Accounts)]
pub struct RevealWinner<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [SOLANA_RAFFLE],
        bump = raffle_state.bump
    )]
    pub raffle_state: Account<'info, RaffleState>,
}

pub fn reveal_winner(
    Context {
        accounts: RevealWinner {
            payer,
            raffle_state,
        },
        ..
    }: Context<RevealWinner>,
) -> Result<()> {
    if raffle_state.game_ended {
        return Err(error!(CustomError::RaffleNotOpen));
    }

    let time_now = Clock::get()?.unix_timestamp as u64;

    // There are special cases that the winner could be revealed immediately
    // 1. Reached end time
    // 2. The player amount reached maximum
    // 3. The owner of the program demands to reveal
    // If there are still slots for new players,
    // game has not yet ended
    // and the caller is not the author of the program
    // -> Throws an error
    if !raffle_state.players.is_empty()
        && raffle_state.players.len() < MAX_PLAYERS
        && time_now < raffle_state.end
        && raffle_state.authority != payer.key()
    {
        println!("Current time: {}", time_now);
        println!("Raffle ends in: {}", raffle_state.end);
        return Err(error!(CustomError::RaffleOngoing));
    }

    // If the winner is selected, then halts the function
    if raffle_state.winner.is_some() {
        return Err(error!(CustomError::WinnerSelected));
    }

    let mut rand = oorandom::Rand64::new(time_now.into());
    let winner_index = rand.rand_range(0..raffle_state.players.len() as u64);
    let winner = raffle_state.players[winner_index as usize];

    let prize_pool = raffle_state.ticket_price * raffle_state.players.len() as u64;

    println!(
        "The player {} is the winner of {} lamports, if you're the winner please claim the prize",
        winner, prize_pool
    );

    raffle_state.winner = Some(winner);

    Ok(())
}
