class Track{constructor(songid, albumid, instrumental, songname, album, year, spotify, youtube, soundcloud, coverPath, filePath, runtime){this.songid=songid; this.albumid=albumid; this.instrumental=instrumental; this.songname=songname; this.album=album; this.year=year; this.spotify=spotify; this.youtube=youtube; this.soundcloud=soundcloud; this.coverPath=coverPath; this.filePath=filePath; this.runtime=runtime}}
var tracks=[];
tracks.push(new Track("toil", "quarry", "y", "Nonstop Toil", "From The Quarry", "2020", "", "https://youtu.be/NNrJnHprVcU", "", "img/icons/quarry.jpg", "audio/toil.mp3", "1:35"));
tracks.push(new Track("tripwired2", "quarry", "n", "Tripwired", "From The Quarry", "2020", "", "https://youtu.be/rNJvG8KgjO0", "https://soundcloud.com/bensomerville/tripwired-q-edition", "img/icons/quarry.jpg", "audio/tripwired2.mp3", "5:36"));
tracks.push(new Track("sorentino", "quarry", "y", "Sorentino", "From The Quarry", "2020", "", "https://youtu.be/kklpb8LWkX8", "", "img/icons/quarry.jpg", "audio/sorentino.mp3", "1:47"));
tracks.push(new Track("eastcoast", "eastcoast", "n", "It's June On The East Coast Of Brazil", "", "2018", "https://open.spotify.com/track/0bnme9xfqisaAirmbXC0rk?si=Pe8pf6inSDmy9JoXqH2uxQ", "https://youtu.be/HyGNdFQCy7M", "https://soundcloud.com/bensomerville/its-june-on-the-east-coast", "img/icons/eastcoast.jpg", "audio/eastcoast.mp3", "4:57"));
tracks.push(new Track("tension", "entanglement", "n", "The Tension", "Entanglement", "2017", "https://open.spotify.com/track/3kVfb3zxABzn4Z5YDjWCjQ?si=_OemQKkKQ2uUbvqR78sZwQ", "https://youtu.be/d5HfaiyunUM", "https://soundcloud.com/bensomerville/the-tension?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/tension.mp3", "3:56"));
tracks.push(new Track("diminishing", "entanglement", "n", "Diminishing Eye", "Entanglement", "2017", "https://open.spotify.com/track/3sIXx9y0TBXfO1W8qugI7Q?si=hiHn_8cVTdO21bjjtxNy6Q", "https://youtu.be/B-KuEay5AiI", "https://soundcloud.com/bensomerville/diminishing-eye?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/diminishing.mp3", "3:15"));
tracks.push(new Track("stage", "entanglement", "n", "The Stage", "Entanglement", "2017", "https://open.spotify.com/track/52NwXwTzViIpOXGBe6i606?si=8RuqAbgOQkGeO9YqQbpMIg", "https://youtu.be/EbsQynzM7eY", "https://soundcloud.com/bensomerville/the-stage?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/stage.mp3", "4:01"));
tracks.push(new Track("pullmeapart", "entanglement", "n", "Pull Me Apart", "Entanglement", "2017", "https://open.spotify.com/track/4V2BXtOP4Z3tHVIfpvjwBE?si=JpDFiT5_ReSbtRkRxDdTZA", "https://youtu.be/qkOy3E85z9c", "https://soundcloud.com/bensomerville/pull-me-apart?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/pullmeapart.mp3", "3:44"));
tracks.push(new Track("rest", "entanglement", "n", "Rest", "Entanglement", "2017", "https://open.spotify.com/track/2NcX2UOH4kJ5VXgTAC92Sw?si=0VGudAdORrSRsBbdCnHE7w", "https://youtu.be/gWHP4QruZ_o", "https://soundcloud.com/bensomerville/rest?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/rest.mp3", "3:10"));
tracks.push(new Track("mrforeigner", "entanglement", "n", "Mr Foreigner", "Entanglement", "2017", "https://open.spotify.com/track/1x4wMCIv8taxNHRPjdIB57?si=bXTCvUUHRLCTOryU9YCfUQ", "https://youtu.be/QtP-pZH3-HU", "https://soundcloud.com/bensomerville/mr-foreigner?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/mrforeigner.mp3", "5:05"));
tracks.push(new Track("imaginarypain", "entanglement", "n", "Imaginary Pain", "Entanglement", "2017", "https://open.spotify.com/track/3mkwbyCZYr9pi2DjkdbOr5?si=0orBySHpQnydIwVPS3r7PA", "https://youtu.be/UhoXqXqqzqE", "https://soundcloud.com/bensomerville/imaginary-pain?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/imaginarypain.mp3", "3:54"));
tracks.push(new Track("togive", "entanglement", "n", "To Give Is To Love", "Entanglement", "2017", "https://open.spotify.com/track/0onZt7azFCsFaS3oePadoH?si=JmerK6XzTQqzQBC-gmLuww", "https://youtu.be/7OmZ5MA-MGg", "https://soundcloud.com/bensomerville/to-give-is-to-love?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/togive.mp3", "3:31"));
tracks.push(new Track("ithought", "entanglement", "n", "I Thought Too Much Of You", "Entanglement", "2017", "https://open.spotify.com/track/3ZxcA7LgmWeJ9PlfqTboQ4?si=ztDgdhJtQ16rQgrKhqg3eg", "https://youtu.be/45gC5LVNkR8", "https://soundcloud.com/bensomerville/i-thought-too-much-of-you?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/ithought.mp3", "3:47"));
tracks.push(new Track("father", "entanglement", "n", "Father, Awaken Us!", "Entanglement", "2017", "https://open.spotify.com/track/4kGWnrJRfkC5WA2n1tLF7s?si=WAn4LT2CQ8qlrsj0qi-8SA", "https://youtu.be/IyfYeEnUvVM", "https://soundcloud.com/bensomerville/father-awaken-us?in=bensomerville/sets/entanglement", "img/icons/entanglement.jpg", "audio/father.mp3", "2:54"));
tracks.push(new Track("cyclopath", "euw", "n", "Cyclopath", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/cyclopath.mp3", "5:02"));
tracks.push(new Track("srj", "euw", "n", "Save Robert Jones", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/srj.mp3", "3:30"));
tracks.push(new Track("topsong", "euw", "n", "Top Song", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/topsong.mp3", "4:54"));
tracks.push(new Track("thatsano", "euw", "n", "That's A No", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/thatsano.mp3", "3:37"));
tracks.push(new Track("sirdoubts", "euw", "n", "Sir Doubts", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/sirdoubts.mp3", "3:06"));
tracks.push(new Track("changesomeone", "euw", "n", "Change Someone", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/changesomeone.mp3", "3:41"));
tracks.push(new Track("fatedelay", "euw", "n", "Fate Delay", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/fatedelay.mp3", "5:33"));
tracks.push(new Track("twoeyes", "euw", "n", "Read With Two Eyes", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/twoeyes.mp3", "4:28"));
tracks.push(new Track("postal", "euw", "n", "Postal", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/postal.mp3", "4:19"));
tracks.push(new Track("wheelless", "euw", "n", "Song For The Wheelless", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/wheelless.mp3", "3:13"));
tracks.push(new Track("anystar", "euw", "n", "Any Star", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/anystar.mp3", "4:44"));
tracks.push(new Track("regrouping", "euw", "y", "Semi-Improvisation in E (A Regrouping)", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/regrouping.mp3", "2:45"));
tracks.push(new Track("gb", "euw", "n", "GB Pharmacy", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/gb.mp3", "3:27"));
tracks.push(new Track("barcode", "euw", "n", "Barcode", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/barcode.mp3", "5:55"));
tracks.push(new Track("hireamaid", "euw", "n", "Hire A Maid", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/hireamaid.mp3", "4:02"));
tracks.push(new Track("stairs", "euw", "n", "10,000 Stairs", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/stairs.mp3", "3:59"));
tracks.push(new Track("sandbridge", "euw", "y", "Sandbridge", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/sandbridge.mp3", "4:00"));
tracks.push(new Track("patricians", "euw", "n", "The Patricians", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/patricians.mp3", "5:05"));
tracks.push(new Track("contraspective", "euw", "n", "Contraspective", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/contraspective.mp3", "3:14"));
tracks.push(new Track("pretensent", "euw", "n", "Pretensent", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/pretensent.mp3", "2:45"));
tracks.push(new Track("whatexcuse", "euw", "n", "What Excuse", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/whatexcuse.mp3", "3:42"));
tracks.push(new Track("fortuneteller", "euw", "n", "Fortune Teller", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/fortuneteller.mp3", "3:03"));
tracks.push(new Track("backbend", "euw", "n", "Backbend", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/backbend.mp3", "3:02"));
tracks.push(new Track("becky", "euw", "n", "Becky", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/becky.mp3", "2:53"));
tracks.push(new Track("sandbridge2", "euw", "y", "Sandbridge (Reprise)", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/sandbridge2.mp3", "3:56"));
tracks.push(new Track("earsunderwater", "euw", "y", "Ears Under Water", "Ears Under Water", "2016", "", "", "", "img/icons/euw.jpg", "audio/earsunderwater.mp3", "5:19"));
tracks.push(new Track("manna", "greenstone", "n", "Manna", "The Greenstone EP", "2015", "https://open.spotify.com/track/3I1dHm2UsaVbamMCeWNf6K?si=xoluF99kSneUajcOfpq44Q", "https://youtu.be/35XT_lcPO1k", "https://soundcloud.com/bensomerville/manna?in=bensomerville/sets/the-greenstone-ep", "img/icons/greenstone.jpg", "audio/manna.mp3", "4:05"));
tracks.push(new Track("counterprofeit", "greenstone", "n", "Counterprofeit", "The Greenstone EP", "2015", "https://open.spotify.com/track/5V7mqYxTU8hsiOstQg6x8k?si=pdPq-ngcSJWYC_SpTtOjqA", "https://youtu.be/KadlpPb_rj0", "https://soundcloud.com/bensomerville/counterprofeit?in=bensomerville/sets/the-greenstone-ep", "img/icons/greenstone.jpg", "audio/counterprofeit.mp3", "3:53"));
tracks.push(new Track("taxi", "greenstone", "y", "Taxintermission", "The Greenstone EP", "2015", "https://open.spotify.com/track/6dBx1wHglg5UjYjHd8PkCP?si=P3Z0vUVFQNKxgoFuzGHjuw", "https://youtu.be/yxNFMht7IlU", "https://soundcloud.com/bensomerville/taxintermission?in=bensomerville/sets/the-greenstone-ep", "img/icons/greenstone.jpg", "audio/taxi.mp3", "1:45"));
tracks.push(new Track("concavescent", "greenstone", "n", "Concavescent", "The Greenstone EP", "2015", "https://open.spotify.com/track/5Rbt0WLdrEiAjYTpa8DAXB?si=heaVkcikR8i5b2HfUQMUhw", "https://youtu.be/9dEORVSh-Wc", "https://soundcloud.com/bensomerville/concavescent?in=bensomerville/sets/the-greenstone-ep", "img/icons/greenstone.jpg", "audio/concavescent.mp3", "3:51"));
tracks.push(new Track("tripwired", "greenstone", "n", "Tripwired", "The Greenstone EP", "2015", "https://open.spotify.com/track/4pJRq1gaMJWhXWDCynZcty?si=NFWZHuWiREatY3R61iXAxg", "https://youtu.be/m_9hC8LaAOE", "https://soundcloud.com/bensomerville/tripwired?in=bensomerville/sets/the-greenstone-ep", "img/icons/greenstone.jpg", "audio/tripwired.mp3", "5:38"));
tracks.push(new Track("endothermic", "greenstone", "n", "Endothermic", "The Greenstone EP", "2015", "https://open.spotify.com/track/4DBcz16GHnxsevcAizwYqD?si=J3W9Ux73RXyFTiXTYiOR6A", "https://youtu.be/m_9hC8LaAOE", "https://soundcloud.com/bensomerville/endothermic?in=bensomerville/sets/the-greenstone-ep", "img/icons/greenstone.jpg", "audio/endothermic.mp3", "3:26"));
tracks.push(new Track("cactusjuice", "stainless", "y", "Cactus Juice", "Stainless Cactus", "2015", "", "", "", "img/icons/stainless.jpg", "audio/cactusjuice.mp3", "1:49"));
tracks.push(new Track("frozenfloor", "stainless", "y", "On A Frozen Floor", "Stainless Cactus", "2015", "", "", "", "img/icons/stainless.jpg", "audio/frozenfloor.mp3", "3:27"));
tracks.push(new Track("trypnosis", "stainless", "y", "Trypnosis", "Stainless Cactus", "2015", "", "", "", "img/icons/stainless.jpg", "audio/trypnosis.mp3", "2:06"));
tracks.push(new Track("rhythmic", "stainless", "y", "Rhythmic Hums And Buzzes Of The Milky Way", "Stainless Cactus", "2015", "", "", "", "img/icons/stainless.jpg", "audio/rhythmic.mp3", "6:04"));

var noList = [];
var euw = ["cyclopath", "srj", "topsong", "thatsano", "sirdoubts", "changesomeone", "fatedelay", "twoeyes", "postal", "wheelless", "anystar", "regrouping", "gb", "barcode", "hireamaid", "stairs", "sandbridge", "patricians", "contraspective", "pretensent", "whatexcuse", "fortuneteller", "backbend", "becky", "sandbridge2", "earsunderwater"];
var euwCondensed = ["gb", "thatsano", "anystar", "postal", "stairs", "fortuneteller", "topsong", "whatexcuse", "fatedelay", "becky"];
var eastcoast = ["eastcoast"];
var entanglement = ["tension", "diminishing", "stage", "pullmeapart", "rest", "mrforeigner","imaginarypain", "togive", "ithought", "father"];
var greenstone = ["manna", "counterprofeit", "taxi", "concavescent", "tripwired", "endothermic"];
var stainless = ["cactusjuice", "frozenfloor", "trypnosis", "rhythmic"];
var quarry = ["toil", "tripwired2", "sorentino"];