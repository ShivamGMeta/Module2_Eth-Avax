import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const [message, setMessage] = useState("");
  const [ownerName, setOwnerName] = useState("Shivam Gupta");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }


  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }


  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const checkOwner = async() => {
    if(atm){
      let owner = await atm.checkOwner();
      setOwnerName(owner);
    }
  }


  const purchaseFruit = async (fruit) => {
    if (atm) {
      let tx = await atm.withdraw(1);  // Assuming withdraw function for subtracting 1 ETH
      await tx.wait();
      setMessage(`Fruit bought successfully: ${fruit}`);
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>

        <p style={{ fontFamily: "sans-serif"}}>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p style={{ fontFamily: "sans-serif"}}>Owner Name : {ownerName}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <div>
          <h3>Buy Fruits</h3>
          <img src="mango.png" alt="Mango" />
          <button onClick={() => purchaseFruit("Mango")}>Buy Mango</button>         
          <button onClick={() => purchaseFruit("Apple")}>Buy Apple</button>
          <button onClick={() => purchaseFruit("Banana")}>Buy Banana</button>
          <button onClick={() => purchaseFruit("Grapes")}>Buy Grapes</button>
          <button onClick={() => purchaseFruit("Watermelon")}>Buy Watermelon</button>
          <button onClick={() => purchaseFruit("Muskmelon")}>Buy Muskmelon</button>
          <button onClick={() => purchaseFruit("Pomegranate")}>Buy Pomegranate</button>
        </div>
        {message && <p>{message}</p>}
      </div>
      
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      {/* <header><h1>Welcome to the Metacrafters ATM!</h1></header> */}
      <header><h1>Welcome!</h1></header>
      <p>Please Click on the button blow to set <b>Wallet Conncetion</b></p>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
