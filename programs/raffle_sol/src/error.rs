use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("You're not authorized to perform this action")]
    NotAuthorized,

    #[msg("Raffle is closed")]
    RaffleNotOpen,

    #[msg("Raffle is still ongoing")]
    RaffleOngoing,

    #[msg("Winner was already selected")]
    WinnerSelected,

    #[msg("Winner has not been selected")]
    WinnerNotSelected,

    #[msg("Unfortunately, you're not the winner, try again next time!")]
    IncorrectWinner,
}
