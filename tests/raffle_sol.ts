import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RaffleSol } from "../target/types/raffle_sol";
import {
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { step } from "mocha-steps";

describe("raffle_sol", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;
  const program = anchor.workspace.RaffleSol as Program<RaffleSol>;

  // Initialize players
  const alice = new anchor.Wallet(anchor.web3.Keypair.generate());
  const bob = new anchor.Wallet(anchor.web3.Keypair.generate());
  const charlie = new anchor.Wallet(anchor.web3.Keypair.generate());

  beforeEach((done) => setTimeout(done, 700));

  before(async () => {
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction({
      signature: airdropSignature,
      blockhash,
      lastValidBlockHeight,
    });

    const space = 0;

    const rentExemptionAmount =
      await connection.getMinimumBalanceForRentExemption(space);

    const accountsCreation = new Transaction()
      .add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: alice.publicKey,
          lamports: rentExemptionAmount,
          space,
          programId: SystemProgram.programId,
        })
      )
      .add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: bob.publicKey,
          lamports: rentExemptionAmount,
          space,
          programId: SystemProgram.programId,
        })
      )
      .add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: charlie.publicKey,
          lamports: rentExemptionAmount,
          space,
          programId: SystemProgram.programId,
        })
      );

    await sendAndConfirmTransaction(connection, accountsCreation, [
      wallet.payer,
      alice.payer,
      bob.payer,
      charlie.payer,
    ]);

    await connection.requestAirdrop(wallet.publicKey, 200);
    console.log("Wallet: ", await connection.getBalance(wallet.publicKey));
    await connection.requestAirdrop(alice.publicKey, 200);
    console.log("Alice: ", await connection.getBalance(alice.publicKey));
    await connection.requestAirdrop(bob.publicKey, 200);
    console.log("Bob: ", await connection.getBalance(bob.publicKey));
    await connection.requestAirdrop(charlie.publicKey, 200);
    console.log("Charlie: ", await connection.getBalance(charlie.publicKey));
  });

  async function buyTicket(ticketBuyer: anchor.web3.Signer) {
    const tx = await program.methods
      .buyTicket()
      .accounts({
        payer: ticketBuyer.publicKey,
      })
      .signers([ticketBuyer])
      .rpc();

    console.log("Buy ticket success. Transaction signature: ", tx);
  }

  step("Is initialized!", async () => {
    const fiveMinutes = 5 * 60;
    // const start = Math.floor(Date.now() / 1000);

    const slot = await connection.getSlot();
    const start = await connection.getBlockTime(slot);
    const end = start + fiveMinutes; // Adds extra time

    const tx = await program.methods
      .init(new anchor.BN(start), new anchor.BN(end), new anchor.BN(100))
      .accounts({
        payer: wallet.publicKey,
      })
      .rpc();

    console.log("Transaction signature: ", tx);
  });

  step("Is buying tickets!", async () => {
    await buyTicket(wallet.payer);
    await buyTicket(alice.payer);
    await buyTicket(bob.payer);
    await buyTicket(charlie.payer);
  });

  step("Is revealing a winner", async () => {
    const tx = await program.methods
      .revealWinner()
      .accounts({
        payer: wallet.publicKey,
      })
      .rpc();
    console.log("Reveal winner success. Transaction signature: ", tx);
  });

  step("Is claiming the prize", async () => {
    // This test not only tests if the money transfer works,
    // but it can only check if only the winner gets the money while everyone gets an error

    program.methods
      .claimPrize()
      .accounts({
        payer: wallet.publicKey,
      })
      .signers([wallet.payer])
      .rpc()
      .then(() => {});

    program.methods
      .claimPrize()
      .accounts({
        payer: alice.publicKey,
      })
      .signers([alice.payer])
      .rpc()
      .then(() => {});

    program.methods
      .claimPrize()
      .accounts({
        payer: bob.publicKey,
      })
      .signers([bob.payer])
      .rpc()
      .then(() => {});

    program.methods
      .claimPrize()
      .accounts({
        payer: charlie.publicKey,
      })
      .signers([charlie.payer])
      .rpc()
      .then(() => {});
  });

  step("Is resetting the game", async () => {
    const fiveMinutes = 5 * 60;
    const slot = await connection.getSlot();
    const start = await connection.getBlockTime(slot);
    const end = start + fiveMinutes; // Adds extra time

    const tx = await program.methods
      .resetRaffle(new anchor.BN(start), new anchor.BN(end), new anchor.BN(100))
      .accounts({
        payer: wallet.publicKey,
      })
      .signers([wallet.payer])
      .rpc();

    console.log("Reset game success. Transaction signature: ", tx);
  });

  step("Is showing all wallets", async () => {
    // Get balance of all wallets
    console.log(
      "The owner has: ",
      await connection.getBalance(wallet.publicKey)
    );
    console.log("Alice has: ", await connection.getBalance(alice.publicKey));
    console.log("Bob has: ", await connection.getBalance(bob.publicKey));
    console.log(
      "Charlie has: ",
      await connection.getBalance(charlie.publicKey)
    );
  });
});
