/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  CannonRegistry,
  CannonRegistryInterface,
} from "../../contracts/CannonRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ImplementationIsSterile",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
    ],
    name: "InvalidName",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "url",
        type: "string",
      },
    ],
    name: "InvalidUrl",
    type: "error",
  },
  {
    inputs: [],
    name: "NoChange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contr",
        type: "address",
      },
    ],
    name: "NotAContract",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "NotNominated",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "UpgradeSimulationFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerNominated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "version",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32[]",
        name: "tags",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "string",
        name: "url",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "PackagePublish",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "MIN_PACKAGE_NAME_LENGTH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_name",
        type: "bytes32",
      },
    ],
    name: "acceptPackageOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getImplementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_protocolName",
        type: "bytes32",
      },
    ],
    name: "getPackageNominatedOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_protocolName",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_protocolVersion",
        type: "bytes32",
      },
    ],
    name: "getPackageUrl",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_protocolName",
        type: "bytes32",
      },
    ],
    name: "getPackageVersions",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPackages",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newNominatedOwner",
        type: "address",
      },
    ],
    name: "nominateNewOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_name",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "nominatePackageOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nominatedOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_version",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "_tags",
        type: "bytes32[]",
      },
      {
        internalType: "string",
        name: "_url",
        type: "string",
      },
    ],
    name: "publish",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceNomination",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "simulateUpgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
    ],
    name: "validatePackageName",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612499806100206000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c806379ba5097116100a2578063b723522a11610071578063b723522a14610282578063c7f62cda1461029e578063f52cbda5146102ba578063f94c6ffc146102d6578063ffd81002146103065761010b565b806379ba50971461020c5780637d67a99d146102165780638da5cb5b14610246578063aaf10f42146102645761010b565b806353a47bb7116100de57806353a47bb7146101965780635c05a89f146101b457806360e11780146101d2578063718fe928146102025761010b565b80631627540c146101105780632f4023231461012c5780633659cfe61461015c57806340142a6314610178575b600080fd5b61012a60048036038101906101259190611b5c565b610322565b005b61014660048036038101906101419190611bbf565b6104e7565b6040516101539190611bfb565b60405180910390f35b61017660048036038101906101719190611b5c565b61052d565b005b610180610541565b60405161018d9190611c2f565b60405180910390f35b61019e610546565b6040516101ab9190611bfb565b60405180910390f35b6101bc610579565b6040516101c99190611d08565b60405180910390f35b6101ec60048036038101906101e79190611d2a565b6105da565b6040516101f99190611e03565b60405180910390f35b61020a61069a565b005b610214610781565b005b610230600480360381019061022b9190611bbf565b61090e565b60405161023d9190611e40565b60405180910390f35b61024e610c31565b60405161025b9190611bfb565b60405180910390f35b61026c610c64565b6040516102799190611bfb565b60405180910390f35b61029c60048036038101906102979190612058565b610c97565b005b6102b860048036038101906102b39190611b5c565b6110a8565b005b6102d460048036038101906102cf9190611bbf565b6112d3565b005b6102f060048036038101906102eb9190611bbf565b61142c565b6040516102fd9190611d08565b60405180910390f35b610320600480360381019061031b91906120f7565b6114a0565b005b600061032c61159f565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461036b5761036a6115d2565b5b600061037561164b565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156103de576040517fd92e233d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610468576040517fa88ee57700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b828160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f906a1c6bd7e3091ea86693dd029a831c19049ce77f1dce2ce0bab1cacbabce22836040516104da9190611bfb565b60405180910390a1505050565b60006104f1611673565b600401600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6105356115d2565b61053e8161169b565b50565b600381565b600061055061164b565b60010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060610583611673565b6000018054806020026020016040519081016040528092919081815260200182805480156105d057602002820191906000526020600020905b8154815260200190600101908083116105bc575b5050505050905090565b60606105e4611673565b60010160008481526020019081526020016000206000838152602001908152602001600020805461061490612166565b80601f016020809104026020016040519081016040528092919081815260200182805461064090612166565b801561068d5780601f106106625761010080835404028352916020019161068d565b820191906000526020600020905b81548152906001019060200180831161067057829003601f168201915b5050505050905092915050565b60006106a461164b565b90503373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461073a57336040517fa0e5a0d70000000000000000000000000000000000000000000000000000000081526004016107319190611bfb565b60405180910390fd5b60008160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600061078b61164b565b905060008160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461082657336040517fa0e5a0d700000000000000000000000000000000000000000000000000000000815260040161081d9190611bfb565b60405180910390fd5b7fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c8260000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff168260405161087b929190612198565b60405180910390a1808260000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008260010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600080600090505b6020811015610c2657600060f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916838260208110610959576109586121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161415610a13576003811015610998576000915050610c2c565b7f2d00000000000000000000000000000000000000000000000000000000000000836001836109c7919061221f565b602081106109d8576109d76121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161415610a0e576000915050610c2c565b610c26565b7f3000000000000000000000000000000000000000000000000000000000000000838260208110610a4757610a466121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161080610ad057507f3900000000000000000000000000000000000000000000000000000000000000838260208110610aa857610aa76121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916115b8015610b9557507f6100000000000000000000000000000000000000000000000000000000000000838260208110610b0b57610b0a6121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161080610b9457507f7a00000000000000000000000000000000000000000000000000000000000000838260208110610b6c57610b6b6121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916115b5b8015610c0457506000811480610c0357507f2d00000000000000000000000000000000000000000000000000000000000000838260208110610bda57610bd96121c1565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614155b5b15610c13576000915050610c2c565b8080610c1e90612253565b915050610916565b50600190505b919050565b6000610c3b61164b565b60000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000610c6e6118c6565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000610ca1611673565b9050600082511415610cea57816040517fb17265ae000000000000000000000000000000000000000000000000000000008152600401610ce19190611e03565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1681600201600087815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614158015610dbd57503373ffffffffffffffffffffffffffffffffffffffff1681600201600087815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b15610df4576040517f82b4290000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1681600201600087815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610f2857610e678561090e565b610ea857846040517f7de0e788000000000000000000000000000000000000000000000000000000008152600401610e9f91906122ab565b60405180910390fd5b3381600201600087815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000018590806001815401808255809150506001900390600052602060002001600090919091909150555b600081600101600087815260200190815260200160002060008681526020019081526020016000208054610f5b90612166565b90501415610fa0578060030160008681526020019081526020016000208490806001815401808255809150506001900390600052602060002001600090919091909150555b8181600101600087815260200190815260200160002060008681526020019081526020016000209080519060200190610fda929190611a47565b5060005b835181101561104f57828260010160008881526020019081526020016000206000868481518110611012576110116121c1565b5b60200260200101518152602001908152602001600020908051906020019061103b929190611a47565b50808061104790612253565b915050610fde565b508260405161105e9190612356565b604051809103902084867f6c8c84feec9ad973456fdeac2596f6e0a4f4d3a6896247597eb2e1da5c0e7101853360405161109992919061236d565b60405180910390a45050505050565b60006110b26118c6565b905060018160000160146101000a81548160ff02191690831515021790555060008160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050828260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008373ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16633659cfe6846040516024016111839190611bfb565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516111d291906123e4565b600060405180830381855af49150503d806000811461120d576040519150601f19603f3d011682016040523d82523d6000602084013e611212565b606091505b5050905080158061127a57508173ffffffffffffffffffffffffffffffffffffffff1661123d6118c6565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b156112b1576040517fa1cfa5a800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008360000160146101000a81548160ff021916908315150217905550600080fd5b60006112dd611673565b9050600081600401600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461137e576040517f82b4290000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8082600201600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600082600401600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b6060611436611673565b600301600083815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561149457602002820191906000526020600020905b815481526020019060010190808311611480575b50505050509050919050565b60006114aa611673565b90503373ffffffffffffffffffffffffffffffffffffffff1681600201600085815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611546576040517f82b4290000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8181600401600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b60006115a961164b565b60000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6115da61159f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461164957336040517f8e4a23d60000000000000000000000000000000000000000000000000000000081526004016116409190611bfb565b60405180910390fd5b565b60007f66d20a9eef910d2df763b9de0d390f3cc67f7d52c6475118cd57fa98be8cf6cb905090565b60007fd386b53009e5ad6d6853d9184c05c992a989289c1761a6d9dd1cdfd204098522905090565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611702576040517fd92e233d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61170b816118ee565b61174c57806040517f8a8b41ec0000000000000000000000000000000000000000000000000000000081526004016117439190611bfb565b60405180910390fd5b60006117566118c6565b90508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156117e2576040517fa88ee57700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8060000160149054906101000a900460ff16158015611806575061180582611901565b5b1561184857816040517f1550430100000000000000000000000000000000000000000000000000000000815260040161183f9190611bfb565b60405180910390fd5b818160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b826040516118ba9190611bfb565b60405180910390a15050565b60007f32402780481dd8149e50baad867f01da72e2f7d02639a6fe378dbd80b6bb446e905090565b600080823b905060008111915050919050565b60008060003073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1663c7f62cda8660405160240161194a9190611bfb565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161199991906123e4565b600060405180830381855af49150503d80600081146119d4576040519150601f19603f3d011682016040523d82523d6000602084013e6119d9565b606091505b509150915081158015611a3e575063a1cfa5a860e01b6040516020016119ff9190612448565b6040516020818303038152906040528051906020012081604051602001611a2691906123e4565b60405160208183030381529060405280519060200120145b92505050919050565b828054611a5390612166565b90600052602060002090601f016020900481019282611a755760008555611abc565b82601f10611a8e57805160ff1916838001178555611abc565b82800160010185558215611abc579182015b82811115611abb578251825591602001919060010190611aa0565b5b509050611ac99190611acd565b5090565b5b80821115611ae6576000816000905550600101611ace565b5090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611b2982611afe565b9050919050565b611b3981611b1e565b8114611b4457600080fd5b50565b600081359050611b5681611b30565b92915050565b600060208284031215611b7257611b71611af4565b5b6000611b8084828501611b47565b91505092915050565b6000819050919050565b611b9c81611b89565b8114611ba757600080fd5b50565b600081359050611bb981611b93565b92915050565b600060208284031215611bd557611bd4611af4565b5b6000611be384828501611baa565b91505092915050565b611bf581611b1e565b82525050565b6000602082019050611c106000830184611bec565b92915050565b6000819050919050565b611c2981611c16565b82525050565b6000602082019050611c446000830184611c20565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611c7f81611b89565b82525050565b6000611c918383611c76565b60208301905092915050565b6000602082019050919050565b6000611cb582611c4a565b611cbf8185611c55565b9350611cca83611c66565b8060005b83811015611cfb578151611ce28882611c85565b9750611ced83611c9d565b925050600181019050611cce565b5085935050505092915050565b60006020820190508181036000830152611d228184611caa565b905092915050565b60008060408385031215611d4157611d40611af4565b5b6000611d4f85828601611baa565b9250506020611d6085828601611baa565b9150509250929050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611da4578082015181840152602081019050611d89565b83811115611db3576000848401525b50505050565b6000601f19601f8301169050919050565b6000611dd582611d6a565b611ddf8185611d75565b9350611def818560208601611d86565b611df881611db9565b840191505092915050565b60006020820190508181036000830152611e1d8184611dca565b905092915050565b60008115159050919050565b611e3a81611e25565b82525050565b6000602082019050611e556000830184611e31565b92915050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611e9882611db9565b810181811067ffffffffffffffff82111715611eb757611eb6611e60565b5b80604052505050565b6000611eca611aea565b9050611ed68282611e8f565b919050565b600067ffffffffffffffff821115611ef657611ef5611e60565b5b602082029050602081019050919050565b600080fd5b6000611f1f611f1a84611edb565b611ec0565b90508083825260208201905060208402830185811115611f4257611f41611f07565b5b835b81811015611f6b5780611f578882611baa565b845260208401935050602081019050611f44565b5050509392505050565b600082601f830112611f8a57611f89611e5b565b5b8135611f9a848260208601611f0c565b91505092915050565b600080fd5b600067ffffffffffffffff821115611fc357611fc2611e60565b5b611fcc82611db9565b9050602081019050919050565b82818337600083830152505050565b6000611ffb611ff684611fa8565b611ec0565b90508281526020810184848401111561201757612016611fa3565b5b612022848285611fd9565b509392505050565b600082601f83011261203f5761203e611e5b565b5b813561204f848260208601611fe8565b91505092915050565b6000806000806080858703121561207257612071611af4565b5b600061208087828801611baa565b945050602061209187828801611baa565b935050604085013567ffffffffffffffff8111156120b2576120b1611af9565b5b6120be87828801611f75565b925050606085013567ffffffffffffffff8111156120df576120de611af9565b5b6120eb8782880161202a565b91505092959194509250565b6000806040838503121561210e5761210d611af4565b5b600061211c85828601611baa565b925050602061212d85828601611b47565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061217e57607f821691505b6020821081141561219257612191612137565b5b50919050565b60006040820190506121ad6000830185611bec565b6121ba6020830184611bec565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061222a82611c16565b915061223583611c16565b925082821015612248576122476121f0565b5b828203905092915050565b600061225e82611c16565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612291576122906121f0565b5b600182019050919050565b6122a581611b89565b82525050565b60006020820190506122c0600083018461229c565b92915050565b600081905092915050565b6122da81611b89565b82525050565b60006122ec83836122d1565b60208301905092915050565b600061230382611c4a565b61230d81856122c6565b935061231883611c66565b8060005b8381101561234957815161233088826122e0565b975061233b83611c9d565b92505060018101905061231c565b5085935050505092915050565b600061236282846122f8565b915081905092915050565b600060408201905081810360008301526123878185611dca565b90506123966020830184611bec565b9392505050565b600081519050919050565b600081905092915050565b60006123be8261239d565b6123c881856123a8565b93506123d8818560208601611d86565b80840191505092915050565b60006123f082846123b3565b915081905092915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6000819050919050565b61244261243d826123fb565b612427565b82525050565b60006124548284612431565b6004820191508190509291505056fea26469706673582212205d49c8619db8077b9c0388ae8263e31ec03d652afb7890cde2e3bc6230e89c6064736f6c634300080b0033";

type CannonRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CannonRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CannonRegistry__factory extends ContractFactory {
  constructor(...args: CannonRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CannonRegistry> {
    return super.deploy(overrides || {}) as Promise<CannonRegistry>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): CannonRegistry {
    return super.attach(address) as CannonRegistry;
  }
  override connect(signer: Signer): CannonRegistry__factory {
    return super.connect(signer) as CannonRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CannonRegistryInterface {
    return new utils.Interface(_abi) as CannonRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CannonRegistry {
    return new Contract(address, _abi, signerOrProvider) as CannonRegistry;
  }
}
