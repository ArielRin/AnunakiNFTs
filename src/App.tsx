import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  useToast,
  Button,
  Input,
} from '@chakra-ui/react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import AnunakiNFTRewardsStaking from './AnunakiNFTRewardsStaking.json'; // Replace with the correct path

import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './bkganu.png';
import HausLogo1 from './logo.png';
import MainTextLogo from './anuhader.png';

const STAKING_CONTRACT_ADDRESS = '0xYourStakingContractAddress'; // Replace with your actual contract address
const STAKING_CONTRACT_ABI = './AnunakiNFTRewardsStaking.json';

const CONTRACT_ADDRESS = '0x03965dEc6f765ddCA73282065B9646950a613618';
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);


  const toast = useToast();



  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });

  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const calculateTotalPrice = () => {
    const pricePerToken = 5000; // Adjust the price per token as needed
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 80));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait(); // Wait for the transaction to be mined
    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };



  async function fetchContractData() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
      const name = await contract.name();
      const supply = await contract.totalSupply();
      setContractName(name);
      setTotalSupply(supply.toNumber());
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, []);

  const maxSupply = 106;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <>
      <header>
        <img src={MainTextLogo} alt="Logo" className="logo" />
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>

      <div
        className="wrapper"
        style={{
          backgroundColor: 'black',
          color: 'white',
          backgroundImage: `url(${backgroundGif})`,
          backgroundSize: 'cover',
        }}
      >
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab>Anunaki NFT</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>


                <div>

                      <img src={MainTextLogo} alt="Anunaki DeFi" className="logobody" />
                  <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>


                  </Text>
                  <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}  `}
                  </Text>
                  <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
                  </Text>
                  <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    <Link isExternal href={getExplorerLink()}>
                      {CONTRACT_ADDRESS}
                    </Link>
                  </Text>
                </div>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>

                  </Text>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                    Now only 5,000 PWR Each
                  </Text>
                <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                  <Button
                    marginTop='1'
                    textColor='white'
                    bg='#fcbb63'
                    _hover={{
                      bg: '#fffda4',
                    }}
                    onClick={handleDecrement}
                    disabled={!isConnected || mintLoading || mintAmount === 1}
                  >
                    -
                  </Button>
                  <Text marginX='3' textAlign='center' fontSize='lg'>
                    {mintAmount}
                  </Text>
                  <Button
                    marginTop='1'
                    textColor='white'
                    bg='#fcbb63'
                    _hover={{
                      bg: '#fffda4',
                    }}
                    onClick={handleIncrement}
                    disabled={!isConnected || mintLoading || mintAmount === 60}
                  >
                    +
                  </Button>
                </Box>



                <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                  <Button
                    disabled={!isConnected || mintLoading}
                    marginTop='6'
                    onClick={onMintClick}
                    textColor='white'
                    bg='#fcbb63'
                    _hover={{
                      bg: '#fffda4',
                    }}
                  >
                    {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                  </Button>
                </Box>
                {mintError && (
                  <Text marginTop='4'>⛔️ Mint unsuccessful! Error message:</Text>
                )}
                {mintError && (
                  <pre style={{ marginTop: '8px', color: 'red' }}>
                    <code>{JSON.stringify(mintError, null, ' ')}</code>
                  </pre>
                )}
                {mintLoading && <Text marginTop='2'>Minting... please wait</Text>}
                {mintedTokenId && (
                  <Text marginTop='2'>
                    Mint successful! You can view your NFT{' '}
                    <Link
                      isExternal
                      href={getOpenSeaURL()}
                      color='#64c6ff'
                      textDecoration='underline'
                    >
                      Soon!
                    </Link>
                  </Text>
                )}

                </TabPanel>

              </TabPanels>
            </Tabs>
            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              &copy; Anunaki DeFi Platform 2023. All rights reserved.
            </Text>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
