import { ethers } from "ethers";
// A single Web3 / Ethereum provider solution for all Wallets
import Web3Modal from "web3modal";
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const contractAddress = process.env.CONTRACT_ADDRESS
  // application binary interface is something that defines structure of smart contract deployed.
  const abi = process.env.ABI

  // hooks for required variables
  const [provider, setProvider] = useState();

  const web3ModalRef = useRef();
  // Check if wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);

  // the variable is used to invoke loader
  const [storeLoader, setStoreLoader] = useState(false)
  const [retrieveLoader, setRetrieveLoader] = useState(false)

  // Address of the receiver
  const [receiver, setReceiver] = useState("");
  // Amount to send
  const [amount, setAmount] = useState(0);
  // Number of receivers
  const [receiversNumber, setReceiversNumber] = useState(0);


  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getReceivers();
    }
  }, [walletConnected]);


  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();

    const web3Provider = new ethers.BrowserProvider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId.toString() !== '11155111') {
      console.log(chainId.toString())
      window.alert("Change the network to Sepolia");
      throw new Error("Change network to Sepolia");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /*
        connectWallet: Connects the MetaMask wallet
      */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };


  /**
 * Send money to someone
 *  
 */
  async function sendMoney() {
    // Validate input
    if (receiver.length < 1) {
      alert("Please enter a valid address")
      return
    }

    try {
      setStoreLoader(true)
      const signer = await getProviderOrSigner(true);
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      const writeNumTX = await contractWithSigner.sendMoney(receiver, { value: ethers.parseEther(amount) });
      console.log(writeNumTX)
      const response = await writeNumTX.wait()
      console.log(await response)
      setStoreLoader(false)

      alert(`${amount} Eth sent to ${receiver}`)
      return

    } catch (error) {
      alert(error)
      setStoreLoader(false)
      return
    }
  }

  /**
* Increase the number of receivers
*  
*/
  async function increaseReceivers() {

    try {
      setStoreLoader(true)
      const signer = await getProviderOrSigner(true);
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      // interact with the methods in smart contract as it's a write operation, we need to invoke the transation usinf .wait()
      const writeNumTX = await contractWithSigner.IncreaseReceivers();
      console.log(writeNumTX)
      const response = await writeNumTX.wait()
      console.log(await response)
      setStoreLoader(false)

      alert(`Number receivers increased by 1`)
      return

    } catch (error) {
      alert(error)
      setStoreLoader(false)
      return
    }
  }

  /**
* Decrease the number of receivers
*  
*/
  async function decreaseReceivers() {

    try {
      setStoreLoader(true)
      const signer = await getProviderOrSigner(true);
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      const writeNumTX = await contractWithSigner.decreaseReceivers();
      console.log(writeNumTX)
      const response = await writeNumTX.wait()
      console.log(await response)
      setStoreLoader(false)

      alert(`Number of receivers decreased by 1`)
      return

    } catch (error) {
      alert(error)
      setStoreLoader(false)
      return
    }
  }

  /**
   * Get the number of receivers
  */
  async function getReceivers(provider) {
    try {
      setRetrieveLoader(true)
      const signer = await getProviderOrSigner(true);

      // initalize smartcontract with the essentials detials.
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      console.log(contractAddress)
      // interact with the methods in smart contract
      const responsee = await contractWithSigner.getReceivers();

      console.log(parseInt(responsee))
      setReceiversNumber(parseInt(responsee))
      setRetrieveLoader(false)
      return
    } catch (error) {
      alert(error)
      setRetrieveLoader(false)
      return
    }
  }

  function handleOnFormSubmit(e) {
    e.preventDefault()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-row bg-white rounded-lg shadow-md ">
        <div>
          <div className="text-2xl font-bold">Send Eth to anyone around the Globe</div>
        </div>
      </div>
      <h4 className="mt-5">The number of receivers so far is <span className='font-bold'>{receiversNumber ? receiversNumber : 0}</span> </h4>
      <button className='px-4 py-1 rounded-2xl bg-slate-300 hover:bg-slate-500 flex justify-around transition-all w-32' onClick={() => getReceivers(provider)}> {retrieveLoader ? (
        <svg
          className="animate-spin m-1 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 text-gray-700"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : "GET"} </button>
      <hr></hr>


      <div>
        <form onSubmit={handleOnFormSubmit} className={"mt-6"}>
          <div className=" flex flex-col space-y-3">

            {/* Company address */}
            <input onChange={(e) => {
              setReceiver(e.target.value);
            }}
              name={'name'} required maxLength={"100"}
              type='text'
              className={"px-6 py-3 align-middle bg-slate-600 text-white rounded-lg border-solid outline-double	w-50"}
              placeholder="Address to send an Eth"
            />

            <input onChange={(e) => {
              setAmount(e.target.value);
            }}
              name={'name'} required maxLength={"10"}
              type='number'
              step={0.1}
              className={"px-6 py-3 align-middle bg-slate-600 text-white rounded-lg border-solid outline-double	w-30"}
              placeholder="Amount of Eth to send"
            />
          </div>
        </form>

        <div className="flex flex-row align-middle items-center">
        </div>
      </div>
      <button onClick={sendMoney} className='rounded-2xl mt-3 px-4 py-1 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-32'> {storeLoader ? (
        <svg
          className="animate-spin m-1 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 text-gray-700"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : "Send"} </button>
      <hr className="mb-5"></hr>

      <button onClick={increaseReceivers} className='rounded-2xl mt-3 px-4 py-1 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-32'> {storeLoader ? (
        <svg
          className="animate-spin m-1 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 text-gray-700"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : "Increase receivers"} </button>

      <button onClick={decreaseReceivers} className='rounded-2xl mt-3 px-4 py-1 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-32'> {storeLoader ? (
        <svg
          className="animate-spin m-1 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 text-gray-700"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : "Decrease receivers"} </button>
    </main>
  )
}
