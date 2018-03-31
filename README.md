# p2p-carsell-raspi

![alt tag](https://user-images.githubusercontent.com/9275193/38164409-438fe77c-34d2-11e8-9123-2be73aa08700.png)

If you are coming to this repo direcly, I would request you to parent repo ( https://github.com/just4give/p2p-carsell-ethereum-raspi.git) first. 

Once you have setup the project from above link on your computer execute below command from inside your Raspberry Pi. Replace LOCAL_TUNNEL_URL which you noted earlier. 

```
git clone https://github.com/just4give/p2p-carsell-raspi.git && cd p2p-carsell-raspi && npm install
RPC_URL="LOCAL_TUNNEL_URL" node .
```

### Prerequisites

Before you can execute above command to start up your nodejs application there are few things you need to do

- Make sure your are running nodejs 4.x or higher. Here is what I have used.
```
pi@raspberrypi:~/p2p-carsell-raspi $ node -v
v4.8.2
pi@raspberrypi:~/p2p-carsell-raspi $ npm -v
1.4.21
pi@raspberrypi:~/p2p-carsell-raspi $ 
```
- Install and configure `motion` software on your Raspberry pi for PiCam module used for live streaming on /dev/video0 
```
sudo apt-get update
sudo apt-get install motion
sudo nano /etc/modules
At the end of the file add below 
bcm2835-v4l2
Ctrl+X , then Y to come out of nano
sudo mkdir /var/lib/motion
sudo chown motion:motion /var/lib/motion
sudo nano /etc/default/motion
change the value to yes for the demon to run on startup 
sudo reboot
```
Once Pi has been rebooted, paste below address on your computer browser to make sure motion is working. You should see live stream from your pi camera.

http://<YOUR_RASPBERRY_IP>:8081/

- Plug in USB Webcamera to your Raspberry Pi which will be used to scan QR code on /dev/video1. Then issue below commands.
``` type below command to make sure your USB camera is recognized by Pi
    $ lsusb
    $ ls -lrt /dev/video1
```
 
![alt tag](https://user-images.githubusercontent.com/9275193/38164659-a2be7724-34d5-11e8-8c05-4b08820f4c48.png)
You should see your camera in the list. I am using Creative Technology, Ltd Live! Cam Sync HD

- Install `zbar` software which will scan the QR Code
```
sudo apt-get install zbar-tools flite
sudo apt-get install python-qrtools
sudo apt-get install libzbar-dev
sudo pip install zbar
```
To make sure zbar installed properly, execute below command on your pi and then bring a sample QR code in front of the webcam. Webcam should be able to decode the QR code.

```
zbarcam --nodisplay --raw /dev/video1
```




