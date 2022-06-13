const reEscape = (s: any) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const badWords = ["Putanginang","Putangina","gago"];
const badWordsExist = new RegExp(badWords.map(reEscape).join('|'));

export function badWordExist(e: any)
{
    if(e.match(badWordsExist)==null)
    {
        return false;
    }
    else
    {
        return true;
    }
}
