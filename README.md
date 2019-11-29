# Cosmic-Forest
Cosmic forest is an alpha version of my thesis project(Unknown Universe). This project is designed as an immersive web VR experience combined with machine learning. All the sounds here are LATENT REPRESENTATION of real forests encoded and decoded through latent space with deep neural networks. You can see how neural networks interpret and extract meaningful features of forest sounds and reconstruct them. 

* [View Project](https://cosmicforest.parkjoohyun.com/) <br>
* [Demo](https://vimeo.com/307056674)


## Generation
#### WaveNet <br> 
The dataset for training WaveNet model consists of 922 30-sec wav files(5.27 GB). It is 8 hour length that has even amount for 4 different categories: birds, creek, wind, bugs&frogs. Training process took 3 days with NVIDIA GPU showing 3.6 sec/step and stopped at 38244 steps with 1.531 loss. Command I used was:

```
python train.py  --data_dir=/<path> --num_steps=200000 --silence_threshold=0 --batch_size=4 --checkpoint_every=1000 
-- max_checkpoints=100 
```

#### NSynth <br>
Generation process took 61 hours for reconstructing 35-40 10-sec wav files using pre-trained model with following command. 

```
nsynth_generate --checkpoint_path=/<path>/wavenet-ckpt/model.ckpt-200000 --source_path=/<path> --save_path=/<path> --batch_size=1 
```

## Tech Stack
* [WaveNet](https://github.com/ibab/tensorflow-wavenet)
* [NSynth(Magenta)](https://github.com/tensorflow/magenta/tree/master/magenta/models/nsynth)
* [A-frame](https://aframe.io/)

## Sound Reference
* [BBC Sound Library](http://bbcsfx.acropolis.org.uk/)
* [NPS Sound Library](https://www.nps.gov/romo/learn/photosmultimedia/soundlibrary.htm)
* [Wildlife Sound Recording Society](https://www.wildlife-sound.org/sounds-of-nature/radio-wsrs)
* [Free To Use Sounds](https://freetousesounds.com/complete-library/)
* [Personal Recordings](https://recordingsofnature.wordpress.com/)
