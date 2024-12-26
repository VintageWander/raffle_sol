use anchor_lang::prelude::*;

use crate::{consts::SOLANA_RAFFLE, error::CustomError, state::RaffleState};

#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [SOLANA_RAFFLE],
        bump = raffle_state.bump
    )]
    pub raffle_state: Account<'info, RaffleState>,
}

pub fn claim_prize(
    Context {
        accounts: ClaimPrize {
            payer,
            raffle_state,
        },
        ..
    }: Context<ClaimPrize>,
) -> Result<()> {
    if raffle_state.game_ended {
        return Err(error!(CustomError::RaffleNotOpen));
    }

    let Some(winner) = raffle_state.winner else {
        return Err(error!(CustomError::WinnerNotSelected));
    };

    if payer.key() != winner {
        println!("Unfortunately, you're not the winner, try again next time!");
        return Ok(());
    }

    let prize_pool = raffle_state.ticket_price * raffle_state.players.len() as u64;

    println!("Congratulations {}, you're the raffle winner", payer.key());
    println!(
        "The entire prize pool of {} lamports will now be transfered to your wallet",
        prize_pool
    );

    raffle_state.sub_lamports(prize_pool)?;
    payer.add_lamports(prize_pool)?;

    raffle_state.game_ended = true;

    println!("The raffle game has ended, wait for the owner to start a new raffle");

    Ok(())
}
