# p2p-carsell-raspi

![alt tag](https://user-images.githubusercontent.com/9275193/38164409-438fe77c-34d2-11e8-9123-2be73aa08700.png)

If you are coming to this repo direcly, I would request you to parent repo ( https://github.com/just4give/p2p-carsell-ethereum-raspi.git) first. 

Once you have setup the project from above link on your computer execute below command from inside your Raspberry Pi. Replace LOCAL_TUNNEL_URL which you noted earlier. 

```
git clone https://github.com/just4give/p2p-carsell-raspi.git && cd p2p-carsell-raspi && npm install
RPC_URL="LOCAL_TUNNEL_URL" node .
```
