const MarsToken = artifacts.require('./MarsLand.sol')

require('chai')
  .should()

contract('MarsToken', ([deployer]) => {
  let marsToken
  const totalSurfaceAreaKm2 = 144798500; //km2
  // only 50% is tradable
  const totalSurfaceAreaKm2Tradable = totalSurfaceAreaKm2 / 2; //km2
  const tokenDecimals = 18;

  before(async () => {
    marsToken = await MarsToken.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marsToken.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name and symbol', async () => {
      const name = await marsToken.name()
      const symbol = await marsToken.symbol()
      assert.equal(name, 'Mars Land')
      assert.equal(symbol, 'MARSX')
    })

    it('has a max supply', async () => {
      const  maxSupply = await marsToken.maxSupply()
      const _totoalTradableAreas = 72399250;
      const maxSup = _totoalTradableAreas * Math.pow(10,tokenDecimals).toFixed()
      assert.equal(maxSup, maxSupply)
    })

    it('allocates the initial supply upon deployment', async () => {
        const toalSupply = await marsToken.totalSupply();
        const _amountMinted = totalSurfaceAreaKm2Tradable / 50;
        const initialMint = _amountMinted * Math.pow(10,tokenDecimals).toFixed();
        assert.equal(initialMint, toalSupply.toString());
    });

    it('Claims 1000 token', async () => {
        let balanceBeforeMint = await marsToken.balanceOf(deployer);
        let _amountMinted = totalSurfaceAreaKm2Tradable / 50;
        let _initMinted = _amountMinted * Math.pow(10,tokenDecimals).toFixed()
        let hasClaimed = await marsToken.hasClaimed(deployer);
        assert.equal(balanceBeforeMint, _initMinted);
        assert.equal(hasClaimed, false);

        await marsToken.claim();
        hasClaimed = await marsToken.hasClaimed(deployer);
        assert.equal(hasClaimed, true)

        let balanceAfterMint = await marsToken.balanceOf(deployer);
        let mintedBN = new web3.utils.BN('1000000000000000000000');
        assert.equal(balanceBeforeMint.add(mintedBN).toString() ,balanceAfterMint.toString())
    });

    it("should not allow claiming free token twice", async function() {
       try {
           await marsToken.claim()
           throw null;
       }
       catch (error) {
           assert(error, "Expected an error but did not get one");
           assert(error.message.toUpperCase().includes("ALREADY CLAIMED"), "Wrong error message:" + error.message);
       }
    });

  })
})
