const snek = require('snekfetch');
const { shuffle, list, verify } = require('../../util/extend');
const dc = require('discord.js');

exports.run = async (client, msg, args) => {
	const embed = new dc.RichEmbed()
  .setColor('#0071FF')
  .addField('<:trivago:457033481025880068> Trivia [tv]', 'test how big your knowledge with randomly quiz', true) 
  .addField('<:akithonkang:457033073981390859> Akinator [aki]', 'you think a character and aki will guess it', true) 
  .addField('<:hangman:459635588253876227> Hangman [hm]', 'guess the word and safe the hanged man', true)
  .setFooter(`💡 To play game using ${msg.prefix}game <game name>`);
  if(!args[0]) return msg.channel.send({embed});
  const game = args[0].toLowerCase();
    if(game === 'trivia' || game === 'tv'){
      Trivia(msg);
    } else if(game === 'akinator' || game === 'aki'){
      Akinator(msg);
    } else if(game === 'hangman' || game === 'hm') {
      Hangman(msg);
    } else if(game === 'gst'){
      GuessThatNumber(msg);
    }else if(game === 'ttt'){
    	TicTacToe(msg);
    }else if(game === 'c4'){
    	ConnectFour(msg);
    }else{
    	return msg.channel.send('❌ **No game named** __' + args.join(' ') + '__');
    }
};

//Trivia Handler
async function Trivia(msg){
  const choices = [ '🇦', '🇧', '🇨', '🇩' ];
  const { body } = await snek.get('https://opentdb.com/api.php?amount=1&encode=url3986');
  if (!body.results) return msg.reply('Oh no, a question could not be fetched. Try again later!');
  const answers = body.results[0].incorrect_answers.map(answer => decodeURIComponent(answer.toLowerCase()));
	const correct = decodeURIComponent(body.results[0].correct_answer.toLowerCase());
	answers.push(correct);
	let shuffled = shuffle(answers);
	const reaction = answers.map((x,i) => choices[i]);
  const embed = new dc.RichEmbed()
    .setColor('#0071FF')
    .setDescription(`**${decodeURIComponent(body.results[0].question)}**` + '\n' + shuffled.map((answer, i) => `**${choices[i]}**. ${answer}`).join('\n'));
	        const msgTrivia = await msg.channel.send('<:trivago:457033481025880068> ' + msg.author + '**You have 15 seconds to answer this question.**', {embed});
	for(const conat of reaction){
		await msgTrivia.react(conat)
	}
	const filter = (rect, user) => reaction.includes(rect.emoji.name) && user.id === msg.author.id;
	const reactions = await msgTrivia.awaitReactions(filter, {max: 1, time: 15000});
			if (!reactions.size){
				msgTrivia.delete();
				return msg.reply(`⏱ **Sorry, time is up! It was __${correct}__.**`);
			}
			const win = shuffled[reaction.indexOf(reactions.first().emoji.name)] === correct;
			if (!win) return msg.reply(`❌**Unfortunately, you're wrong! correct answer is __${correct}__.**`);
			return msg.reply('✅ **You\'re absolutely right.**');
}


//Akinator Handler
const akiSessions = new Map();
	async function Akinator(msg) {
		if (akiSessions.has(msg.channel.id)) return msg.reply('Only one game may be occuring per channel.');
		try {
			let ans = null;
			akiSessions.set(msg.channel.id, { progression: 0 });
			while (akiSessions.get(msg.channel.id).progression < 95) {
				const data = ans === null ? await akiCreateSession(msg.channel) : await akiProgress(msg.channel, ans);
				if (!data || !data.answers || akiSessions.get(msg.channel.id).step >= 80) break;
				const answers = ['y', 'n', 'dk', 'p', 'pn'];
				answers.push('end');
				const embed = new dc.RichEmbed()
         .setDescription('<:akithonkang:457033073981390859> ' + `**${++data.step}.** ${data.question} (${Math.round(Number.parseInt(data.progression, 10))}%)` + '\n' +`${data.answers.map((answer, i)=> `${answer.answer} (${answers[i]})`).join(' | ')}`).
        setColor('#0071FF')
			  await msg.channel.send({embed});
				const filter = res => res.author.id === msg.author.id && answers.includes(res.content.toLowerCase());
				const msgs = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.channel.send('Sorry, time is up!');
					break;
				}
				if (msgs.first().content.toLowerCase() === 'end') break;
				ans = answers.indexOf(msgs.first().content.toLowerCase());
			}
			const guess = await akiGuess(msg.channel);
			if (!guess) { return msg.reply('Hmm... I seem to be having a bit of trouble. Check back soon!'); akiSessions.delete(msg.guild.id); }
			const embed = new dc.RichEmbed()
				.setColor('#0071FF')
				.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
				.setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ''}`)
				.setImage(guess.absolute_picture_path);
			await msg.channel.send({embed});
			const verification = await verify(msg.channel, msg.author);
			akiSessions.delete(msg.channel.id);
			if (verification === 0) return msg.channel.send('I guess your silence means I have won.');
			if (!verification) return msg.channel.send('Bravo, you have defeated me.');
			return msg.channel.send('Guessed right one more time! I love playing with you!');
		} catch (err) {
			akiSessions.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

async function akiCreateSession(channel) {
		const { body } = await snek
			.get('http://192.99.38.142:8126/ws/new_session')
			.query({
				partner: 1,
				player: 'website-desktop',
				constraint: 'ETAT<>\'AV\'',
				soft_constraint: channel.nsfw ? '' : 'ETAT=\'EN\'',
				question_filter: channel.nsfw ? '' : 'cat=1',
				_: Date.now()
			});
		const data = body.parameters;
		if (!data) return null;
		akiSessions.set(channel.id, {
			id: data.identification.session,
			signature: data.identification.signature,
			step: 0,
			progression: Number.parseInt(data.step_information.progression, 10)
		});
		return data.step_information;
	}

async function akiProgress(channel, answer) {
		const session = akiSessions.get(channel.id);
		const { body } = await snek
			.get('http://192.99.38.142:8126/ws/answer')
			.query({
				session: session.id,
				signature: session.signature,
				step: session.step,
				answer,
				question_filter: channel.nsfw ? '' : 'cat=1',
				_: Date.now()
			});
		const data = body.parameters;
		if (!data) return null;
		akiSessions.set(channel.id, {
			id: session.id,
			signature: session.signature,
			step: Number.parseInt(data.step, 10),
			progression: Number.parseInt(data.progression, 10)
		});
		return data;
	}

async function akiGuess(channel) {
		const session = akiSessions.get(channel.id);
		const { body } = await snek
			.get('http://192.99.38.142:8126/ws/list')
			.query({
				session: session.id,
				signature: session.signature,
				step: session.step,
				size: 2,
				max_pic_width: 246,
				max_pic_height: 294,
				pref_photos: 'VO-OK',
				duel_allowed: 1,
				mode_question: 0,
				_: Date.now()
			});
		if (!body.parameters) return null;
		return body.parameters.elements[0].element;
	}
//GuessThatNumber Handler
const GstSet = new Map();
async function GuessThatNumber(msg){
  if(GstSet.has(msg.guild.id)) return msg.reply('Only one game may be occuring per channel.');
  GstSet.set(msg.guild.id, { timeout: false, conum: null});
  const msgsId = msg.channel.id;
  let passes = 0;
  try{
    const number = Math.floor(Math.random()*100);
    msg.channel.send('You have 1 minute to guess that number!');
    const guildData = GstSet.get(msg.guild.id);
    while(passes < 10 && guildData.conum !== number){
    	const filter = res => res.author.id === msg.author.id && !isNaN(res.content);
    	const choice = await msg.channel.awaitMessages(filter, { max:1, time: 15000 });
	    if(!choice.size){ await msg.channel.send('⏱ Sorry, time is up!'); break; }
	    if(choice.first().content === 'end'){ break; }
    	const guess = parseInt(choice.first().content, 10);
    	if(isNaN(guess)) return;
	    if(guess > number){ await msg.channel.send('That number is greather than'); passes++ }
      if(guess < number){ await msg.channel.send('That number is fewer than'); passes++ }
      if(guess === number){
        await GstSet.set(msg.guild.id, { conum: number});
        break;
      }
    }
    GstSet.delete(msg.channel.id);
    if(guildData.conum = number) return msg.channel.send(`✅ You won!, it was ${number}`);
    return msg.channel.send(`❌Too bad... it was ${number}`);
  }catch(e){
    msg.reply(`Oh no an error ocurred \`${e.message}\` try again later`);
    GstSet.delete(msg.channel.id);
  }
}

//Hangman Handler
const hangmanSet = new Set();
async function Hangman (msg){
if (hangmanSet.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		hangmanSet.add(msg.channel.id);
		try {
			const kata = require('../../ast/data/hangman.json');
      const notation = Object.values(kata);
      const noshuf = notation[Math.floor(Math.random()*notation.length)];
      const hashuf = noshuf[Math.floor(Math.random()*noshuf.length)];
			const word = hashuf.Word.toLowerCase().replace(/ /g, '-');
      const body = hashuf.ImageUrl;
			let points = 0;
			const confirmation = [];
			const incorrect = [];
			const display = new Array(word.length).fill('\\_');
			while (word.length !== confirmation.length && points < 7) {
				const emb = new dc.RichEmbed()
				.setColor('#0071FF')
				.setDescription(`
___________
|     |
|    ${points > 0 ? '😧' : ''}
|    ${points > 2 ? '/' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '\\' : ''}
|    ${points > 4 ? '/' : ''} ${points > 5 ? '\\' : ''}
===========
				`)
				.addField('Correct Word', `${display.join(' ')}`, true);
				incorrect.length > 0 ? emb.addField('Incorrect Word', incorrect.join(' ')) : undefined;
				await msg.channel.send('<:hangman:459635588253876227> **Which letter do you choose?**', {embed: emb});
				const filter = res => {
					const choice = res.content.toLowerCase();
					return res.author.id === msg.author.id && !confirmation.includes(choice) && !incorrect.includes(choice);
				};
				const guess = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!guess.size) {
					await msg.channel.send(`**⏱ Sorry, time is up!**`);
					break;
				}
				const choice = guess.first().content.toLowerCase();
				if (choice === 'end') break;
				if (choice.length > 1) break;
				if (word.includes(choice)) {
					for (let i = 0; i < word.length; i++) {
						if (word[i] !== choice) continue; // eslint-disable-line max-depth
						confirmation.push(word[i]);
						display[i] = word[i];
					}
				} else {
					incorrect.push(choice);
					points++;
				}
			}
			hangmanSet.delete(msg.channel.id);
			const embed = new dc.RichEmbed()
			.setColor('#0071FF')
			.setImage(body);
			if (word.length === confirmation.length) return msg.reply(`**✅ You won, it was ${word}!**`, {embed});
			return msg.reply(`**❌ Too bad.... it was ${word}**`, {embed}).then(()=>console.log(body));
		} catch (err) {
			hangmanSet.delete(msg.channel.id);
      console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      console.error(err);
		}
	}
	
	//TicTacToe Handler
	const TictacSet = new Set();
	async function TicTacToe(msg) { 
		if (TictacSet.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		let user;
        if (msg.mentions.users.size) { user = msg.mentions.users.first(); }
        else if (args[0]) { user = await msg.guild.fetchMember(args[0]);
        if (user) { user = user.user; } }
        if (!user) return msg.reply('You must mention someone or give their id'); 
		if (user.bot) return msg.reply('🤖 Bots may not be played against.');
		//if (user.id === msg.author.id) return msg.reply('You may not play against yourself.');
		TictacSet.add(msg.channel.id);
		try {
			await msg.channel.send(`${user}, do you accept this challenge?`);
			const verification = await verify(msg.channel, user);
			if (!verification) {
				TictacSet.delete(msg.channel.id);
				return msg.channel.send('Looks like they declined...');
			}
			const sides = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣'];
      const nomor = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
			const taken = [];
			let userTurn = true;
			let winner = null;
			while (!winner && taken.length < 9) {
				const pUser = userTurn ? msg.author : user;
				const sign = userTurn ? '❎' : '🅾';
				await msg.channel.send('\n' + `
					${pUser}, which side do you pick?
					=============
					${sides[0]}${sides[1]}${sides[2]}
					${sides[3]}${sides[4]}${sides[5]}
					${sides[6]}${sides[7]}${sides[8]}
					=============
				`);
				const filter = res => {
					const choice = res.content;
					return res.author.id === pUser.id && nomor.includes(choice) && !taken.includes(choice);
				};
				const turn = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!turn.size) {
					await msg.channel.send('Sorry, time is up!');
					userTurn = !userTurn;
					continue;
				}
				const choice = turn.first().content;
				sides[Number.parseInt(choice, 10)] = sign;
				taken.push(choice);
				if (
					(sides[0] === sides[1] && sides[0] === sides[2])
					|| (sides[0] === sides[3] && sides[0] === sides[6])
					|| (sides[3] === sides[4] && sides[3] === sides[5])
					|| (sides[1] === sides[4] && sides[1] === sides[7])
					|| (sides[6] === sides[7] && sides[6] === sides[8])
					|| (sides[2] === sides[5] && sides[2] === sides[8])
					|| (sides[0] === sides[4] && sides[0] === sides[8])
					|| (sides[2] === sides[4] && sides[2] === sides[6])
				) winner = userTurn ? msg.author : user;
				userTurn = !userTurn;
			}
			TictacSet.delete(msg.channel.id);
			return msg.channel.send(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.');
		} catch (err) {
			TictacSet.delete(msg.channel.id);
			throw err;
		}
	}
	
	//Connect Four Handler
const connect4Set = new Set();
async function ConnectFour (msg){
	const c4 = require('../../util/game/connect4.js');
	if (connect4Set.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
	let user;
	if (msg.mentions.users.size) { user = msg.mentions.users.first(); }
	else if (args[0]) { user = await msg.guild.fetchMember(args[0]);
	if (user) { user = user.user; } }
	if (!user) return msg.reply('You must mention someone or give their id'); 
	if (user.bot) return msg.reply('🤖 Bots may not be played against.');
	//if (user.id === msg.author.id) return msg.reply('You may not play against yourself.');
	try{
		await msg.channel.send(`${user}, do you accept this challenge?`);
		const verification = await verify(msg.channel, user);
		if(!verification) return msg.channel.send('Looks like they declined...');
		connect4Set.add(msg.channel.id);
		let turn = true;
		let passes = 42;
		let table = c4.newTable()
		const userTurn = turn ? msg.author : user
		const sign = turn ? '🔴' : '🔵';
		const emb = new dc.RichEmbed()
		.setColor('#0071FF')
		.setAuthor(`${userTurn.tag} turn`, userTurn.avatarURL)
		.setDescription(c4.showTable(table));
		const c4Mes = await msg.channel.send(emb);
		const react = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '❌']
		react.forEach(async x => await c4Mes.react(x));
		
		async function doStuff(){
			if(passes === 0){
				connect4Set.delete(msg.channel.id);
				return c4Mes.edit('Oh the cat won!');
			}
			const filter = (reaction, pekok) => react.includes(reaction.emoji.name) && pekok.id === userTurn.id;
			const choice = await c4Mes.awaitReactions(filter, {max: 1, time: 60000});
			if(!choice.size){
				turn = !turn
        connect4Set.delete(msg.channel.id);
				return c4Mes.edit(`Sorry Time is up the winner is ${userTurn}`);
			}
			const choice2 = choice.first().emoji.name;
			const newTab = c4.addVal(table, sign, react.indexOf(choice2));
			if(!newTab) return doStuff();
			table = newTab;
			const isWin = c4.checkWin(table, sign, sign)
			if(!isWin){
				--passes;
				turn = !turn;
				emb.setAuthor(`${userTurn.tag} turn`, userTurn.avatarURL);
				emb.setDescription(c4.showTable(table));
				c4Mes.edit(emb);
				return doStuff();
			}else{
				table = isWin;
				emb.setAuthor(`${userTurn.tag} You're win `, userTurn.avatarURL);
				emb.setDescription(c4.showTable(table));
				connect4Set.delete(msg.channel.id);
				return c4Mes.edit(emb);
			}
		}
	}catch(err){
		connect4Set.delete(msg.channel.id);
		return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
	}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['g', 'games'],
  permLevel: 0
};

exports.help = {
  name : "game",
  description: "Let's play game",
  usage: "game <game name>"
};