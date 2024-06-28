import { useState, useEffect } from "react";
import { ethers } from "ethers";
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

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const checkOwner = async () => {
    if (atm) {
      let owner = await atm.checkOwner();
      setOwnerName(owner);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button className="connect-btn" onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="account-container">
        <p className="account-info">Your Account: {account}</p>
        <p className="account-info">Your Balance: {balance}</p>
        <p className="account-info">Owner Name: {ownerName}</p>
        <button className="action-btn" onClick={deposit}>
          Deposit 1 ETH
        </button>
        <button className="action-btn" onClick={withdraw}>
          Withdraw 1 ETH
        </button>
        <div className="fruit-market">
          <h3>Buy Fruits</h3>
          <div className="fruit-buttons">
            <button className="action-btn" onClick={() => purchaseFruit("Mango")}>
              Buy Mango
            </button>
            <button className="action-btn" onClick={() => purchaseFruit("Apple")}>
              Buy Apple
            </button>
            <button className="action-btn" onClick={() => purchaseFruit("Banana")}>
              Buy Banana
            </button>
            <button className="action-btn" onClick={() => purchaseFruit("Grapes")}>
              Buy Grapes
            </button>
            <button className="action-btn" onClick={() => purchaseFruit("Watermelon")}>
              Buy Watermelon
            </button>
            <button className="action-btn" onClick={() => purchaseFruit("Muskmelon")}>
              Buy Muskmelon
            </button>
            <button className="action-btn" onClick={() => purchaseFruit("Pomegranate")}>
              Buy Pomegranate
            </button>
          </div>
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    );
  };

  const purchaseFruit = async (fruit) => {
    if (atm) {
      let tx = await atm.withdraw(1); // Assuming withdraw function for subtracting 1 ETH
      await tx.wait();
      setMessage(`Fruit bought successfully: ${fruit}`);
      getBalance();
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          padding: 20px;
          border-radius: 10px;
          max-width: 600px;
          margin: auto;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        header {
          background-color: #282c34;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        h1 {
          margin: 0;
        }
        .account-container {
          background-color: white;
          padding: 20px;
          border-radius: 0 0 10px 10px;
        }
        .account-info {
          font-size: 18px;
          color: #333;
        }
        .action-btn {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px;
          transition: background-color 0.3s;
        }
        .action-btn:hover {
          background-color: #0056b3;
        }
        .fruit-market {
          margin-top: 20px;
        }
        .fruit-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .fruit-buttons button {
          margin: 5px;
        }
        .message {
          color: green;
          font-weight: bold;
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}
