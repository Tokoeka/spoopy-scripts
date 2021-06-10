# SPOOKY SCARY SKELETONS

This is tricktreat.ash, but written in TS, interpolated wanderers, and support for a few other things. In the long-run, I'd like this to work for everyone. For now, it works for me. A few features:

 - Kramco, Digitize, and Proton support. These do check if you own the iotm in question, so this code should not cause a problem for you.
 - Bjorn familiar juggling. This does not currently check if you have a bjorn, and does not check if you have the familiars I have. I suggest replacing pickBjorn() with an empty function if you're having trouble with this.
 - Weird, elaborate buffing stuff with a gnome (and possibly riftlet). It will buff up, and maintain familiar buffs, based on the assumption that your MPA is worth 0.04*huge candy + 0.4*chocolate saucepan. 
 - Nemesis aborts. If you're doing the nemesis quest, this should terminate upon seeing your final hitman.
 - Guzzlr stuff with wanderers. This is another place where it assumes you have exactly the iotms I have--if guzzlr sucks, it'll place it into the Deep Dark Jungle, and it'll do platinum quests assuming you have exactly the charters that I have.
 - Free fights support. This does a lot of nice turn0 stuff for when you're prepping to run turns. This assumes you are specifically me. Do not expect it to work if you have any fewer iotms than I.
 - Tot swapping. Would be a pretty shitty script if it didn't.

To run, type `spoop blocks [number]`. To run all of your turns, set the blocks to -1. Set the property `spoopTreatOutfit` to the name of the outfit you want to use, name your combat outfit Trick, and equip the familiar you'd like to use.

To just buff up, type `spoop buff`. To just run a turn 0, `spoop free fights`, and to run essentially a full day (sans buffing), `spoop day`. Pretty straightforward.