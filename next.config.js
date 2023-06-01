/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        CONTRACT_ADDRESS: "0xf282185F38aD25733275d5af2B89B2A68F30C00a",
        ABI: [
            {
                "inputs": [],
                "name": "IncreaseReceivers",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decreaseReceivers",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getReceivers",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    }
                ],
                "name": "sendMoney",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ]
    }
}
module.exports = nextConfig
