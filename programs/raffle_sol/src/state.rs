use anchor_lang::prelude::*;

use crate::consts::MAX_PLAYERS;

#[account]
#[derive(InitSpace)]
pub struct RaffleState {
    pub authority: Pubkey,
    pub bump: u8,
    pub start: u64,
    pub end: u64,
    #[max_len(MAX_PLAYERS)]
    pub players: Vec<Pubkey>,
    pub ticket_price: u64,
    pub winner: Option<Pubkey>,
    pub game_ended: bool,
}

impl RaffleState {
    pub const SIZE: usize = 8 + RaffleState::INIT_SPACE;
}
