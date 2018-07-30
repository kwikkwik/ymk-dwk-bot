const { post } = require('snekfetch');

module.exports = async (text)=>{
  if(!text) return 'You baka';
  try{
    const { body } = await post('https://www.hastebin.com/documents').send(text);
    return `https://www.hastebin.com/${body.key}`;
  }catch(e){
    return e;
  }
}