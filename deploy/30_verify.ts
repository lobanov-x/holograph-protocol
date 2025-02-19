declare var global: any;
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from '@holographxyz/hardhat-deploy-holographed/types';
import { NetworkType, networks } from '@holographxyz/networks';
import { Environment, getEnvironment } from '@holographxyz/environment';
import { SuperColdStorageSigner } from 'super-cold-storage-signer';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.ethers.getSigners();
  let deployer: SignerWithAddress | SuperColdStorageSigner = accounts[0];

  if (global.__superColdStorage) {
    // address, domain, authorization, ca
    const coldStorage = global.__superColdStorage;
    deployer = new SuperColdStorageSigner(
      coldStorage.address,
      'https://' + coldStorage.domain,
      coldStorage.authorization,
      deployer.provider,
      coldStorage.ca
    );
  }

  const network = networks[hre.network.name];
  const environment: Environment = getEnvironment();
  const currentNetworkType: NetworkType = network.type;

  const definedOracleNames = {
    avalanche: 'Avalanche',
    avalancheTestnet: 'AvalancheTestnet',
    binanceSmartChain: 'BinanceSmartChain',
    binanceSmartChainTestnet: 'BinanceSmartChainTestnet',
    ethereum: 'Ethereum',
    ethereumTestnetGoerli: 'EthereumTestnetGoerli',
    polygon: 'Polygon',
    polygonTestnet: 'PolygonTestnet',
    optimism: 'Optimism',
    optimismTestnetGoerli: 'OptimismTestnetGoerli',
    arbitrumNova: 'ArbitrumNova',
    arbitrumOne: 'ArbitrumOne',
    arbitrumTestnetGoerli: 'ArbitrumTestnetGoerli',
    mantle: 'Mantle',
    mantleTestnet: 'MantleTestnet',
    base: 'Base',
    baseTestnetGoerli: 'BaseTestnetGoerli',
    zora: 'Zora',
    zoraTestnetGoerli: 'ZoraTestnetGoerli',
  };

  let targetDropsPriceOracle = 'DummyDropsPriceOracle';
  if (network.key in definedOracleNames) {
    targetDropsPriceOracle = 'DropsPriceOracle' + definedOracleNames[network.key];
  } else {
    if (environment == Environment.mainnet || (network.key != 'localhost' && network.key != 'hardhat')) {
      throw new Error('Drops price oracle not created for network yet!');
    }
  }

  if (currentNetworkType != NetworkType.local) {
    let contracts: string[] = [
      'HolographUtilityToken',
      'hToken',
      'hTokenProxy',
      'Holograph',
      'HolographBridge',
      'HolographBridgeProxy',
      'Holographer',
      'HolographERC20',
      'HolographERC721',
      'HolographDropERC721',
      'HolographDropERC721Proxy',
      'HolographFactory',
      'HolographFactoryProxy',
      'HolographGeneric',
      'HolographGenesis',
      'HolographOperator',
      'HolographOperatorProxy',
      'HolographRegistry',
      'HolographRegistryProxy',
      'HolographTreasury',
      'HolographTreasuryProxy',
      'HolographInterfaces',
      'HolographRoyalties',
      'CxipERC721',
      'CxipERC721Proxy',
      'Faucet',
      'LayerZeroModule',
      'LayerZeroModuleProxy',
      'EditionsMetadataRenderer',
      'EditionsMetadataRendererProxy',
      'OVM_GasPriceOracle',
      'DropsPriceOracleProxy',
      targetDropsPriceOracle,
    ];
    for (let i: number = 0, l: number = contracts.length; i < l; i++) {
      let contract: string = contracts[i];
      try {
        await hre.run('verify:verify', {
          address: (await hre.ethers.getContract(contract)).address,
          constructorArguments: [],
        });
      } catch (error) {
        hre.deployments.log(`Failed to verify ""${contract}" -> ${error}`);
      }
    }
  } else {
    hre.deployments.log('Not verifying contracts on localhost networks.');
  }
};
export default func;
func.tags = ['Verify'];
func.dependencies = [];
