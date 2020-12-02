const pluralizer = function(count : number, singular : string, plural : string) : string {
    if(count == 1){
        return singular;
    } 
    return plural;
}
export default pluralizer