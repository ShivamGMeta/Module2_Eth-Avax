import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [newOwner, setNewOwner] = useState("");
  const [interestRate, setInterestRate] = useState(undefined);
  const [newInterestRate, setNewInterestRate] = useState("");

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
      setAccount(account[0]);
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

  const getOwner = async () => {
    if (atm) {
      setOwner(await atm.getOwner());
    }
  };

  const getInterestRate = async () => {
    if (atm) {
      setInterestRate((await atm.getInterestRate()).toNumber() / 100);
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

  const transferOwnership = async () => {
    if (atm && newOwner) {
      let tx = await atm.setOwner(newOwner);
      await tx.wait();
      getOwner();
    }
  };

  const updateInterestRate = async () => {
    if (atm && newInterestRate) {
      let tx = await atm.setInterestRate(parseInt(newInterestRate));
      await tx.wait();
      getInterestRate();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button className="connect-btn" onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    if (owner === undefined) {
      getOwner();
    }

    if (interestRate === undefined) {
      getInterestRate();
    }

    return (
      <div className="account-container">
        <p className="account-info">Your Account: {account}</p>
        <p className="account-info">Your Balance: {balance} ETH</p>
        <p className="account-info">Contract Owner: {owner}</p>
        <p className="account-info">Current Interest Rate: {interestRate}%</p>
        <button className="action-btn" onClick={deposit}>Deposit 1 ETH</button>
        <button className="action-btn" onClick={withdraw}>Withdraw 1 ETH</button>
        <div className="transfer-ownership">
          <h3>Transfer Ownership</h3>
          <input
            type="text"
            placeholder="New owner's address"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <button className="action-btn" onClick={transferOwnership}>Transfer Ownership</button>
        </div>
        <div className="update-interest-rate">
          <h3>Set Interest Rate</h3>
          <input
            type="number"
            placeholder="New interest rate (in basis points)"
            value={newInterestRate}
            onChange={(e) => setNewInterestRate(e.target.value)}
          />
          <button className="action-btn" onClick={updateInterestRate}>Update Interest Rate</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
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
        .transfer-ownership, .update-interest-rate {
          margin-top: 20px;
        }
        input {
          padding: 10px;
          width: calc(100% - 20px);
          margin-top: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
      `}</style>
    </main>
  );
}
