const reEscape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const badWords = ["Putanginang","Putangina","gago"];
const badWordsRE = new RegExp(badWords.map(reEscape).join('|'));

export function badWordExist(e)
{
    if(e.match(badWordsRE)==null)
    {
        return false;
    }
    else
    {
        return true;
    }
}