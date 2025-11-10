const Arweave = require('arweave');
const { WarpFactory } = require('warp-contracts');

class ARCBountyService {
  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    this.warp = WarpFactory.forMainnet();
  }

  async createBounty(bountyData) {
    try {
      const transaction = await this.arweave.createTransaction({
        data: JSON.stringify({
          type: 'bounty',
          ...bountyData,
          timestamp: Date.now()
        })
      });
      
      await this.arweave.transactions.sign(transaction);
      await this.arweave.transactions.post(transaction);
      
      return {
        success: true,
        txId: transaction.id,
        arweaveUrl: `https://arweave.net/${transaction.id}`,
        message: 'Bounty created on ARC blockchain'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBounty(txId) {
    try {
      const data = await this.arweave.transactions.getData(txId, { decode: true, string: true });
      return {
        success: true,
        data: JSON.parse(data)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createBountyContract(bountyInfo) {
    try {
      // Simple contract source for bounties
      const contractSource = `
        export function handle(state, action) {
          if (action.input.function === 'create') {
            state.creator = action.caller;
            state.amount = action.input.amount;
            state.description = action.input.description;
            state.submissions = [];
            state.claimed = false;
            return { state };
          }
          
          if (action.input.function === 'submit') {
            state.submissions.push({
              submitter: action.caller,
              data: action.input.submission,
              timestamp: Date.now()
            });
            return { state };
          }
          
          if (action.input.function === 'approve') {
            if (action.caller !== state.creator) {
              throw new ContractError('Only bounty creator can approve');
            }
            state.claimed = true;
            state.winner = action.input.winner;
            return { state };
          }
          
          throw new ContractError('Unknown function');
        }
      `;

      const { contractTxId } = await this.warp.createContract.deploy({
        wallet: this.warp.arweave.wallets.generate(),
        initState: JSON.stringify({
          creator: bountyInfo.creator,
          amount: bountyInfo.amount,
          description: bountyInfo.description,
          submissions: [],
          claimed: false
        }),
        src: contractSource
      });

      return {
        success: true,
        contractTxId,
        message: 'Bounty smart contract deployed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ARCBountyService();
