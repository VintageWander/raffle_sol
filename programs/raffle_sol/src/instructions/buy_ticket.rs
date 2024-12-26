use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    consts::{MAX_PLAYERS, SOLANA_RAFFLE},
    error::CustomError,
    state::RaffleState,
};

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut, seeds = [SOLANA_RAFFLE], bump = raffle_state.bump)]
    pub raffle_state: Account<'info, RaffleState>,

    pub system_program: Program<'info, System>,
}

pub fn buy_ticket(
    Context {
        accounts:
            BuyTicket {
                payer,
                raffle_state,
                system_program,
                ..
            },
        ..
    }: Context<BuyTicket>,
) -> Result<()> {
    let clock = Clock::get()?;
    let time_now = clock.unix_timestamp as u64;

    if time_now < raffle_state.start
        || time_now > raffle_state.end
        || raffle_state.players.len() >= MAX_PLAYERS
        || raffle_state.game_ended
    {
        return Err(error!(CustomError::RaffleNotOpen));
    }

    transfer(
        CpiContext::new(
            system_program.to_account_info(),
            Transfer {
                from: payer.to_account_info(),
                to: raffle_state.to_account_info(),
            },
        ),
        raffle_state.ticket_price,
    )?;

    raffle_state.players.push(payer.key());
    println!("Player amount: {}", raffle_state.players.len());

    Ok(())
}
