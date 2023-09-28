var SpellChecker = require('simple-spellchecker');

let conjuntoPalavras = [];

const CARACTERES_ESPECIAIS = 
[
  'á','é','í', 'ó','ú','à',
  'è','ì','ò', 'ù','â','ê',
  'î','ô','û', 'ä','ë','ï','ö', 
  'ü','ã','õ','ñ','ç'
];

// "TÉCNICA" não reconhece por nada
function verificaSeTemCaracterEspecial(palavra) {
  for(elemento of CARACTERES_ESPECIAIS) {
    if (palavra.includes(elemento)) {
      return palavra;
    }
  }

  return false;
}

function verficaParteAntesCaracter(palavraComErro, palavra) {

  if(palavra.length == 1) {
    return true;
  }

  let indexCaracterDefeituoso = String(palavraComErro).indexOf('�') - 1;
  let part1 = palavraComErro.slice(0, indexCaracterDefeituoso)
  let palavra_nova_part = palavra.slice(0, indexCaracterDefeituoso)
  return part1.trim().toLowerCase() == palavra_nova_part.trim().toLowerCase();
}

function verificaGramatica(array_palavras) {
  
  // Melhorar isso posteriomente, está abrindo o dicionário a cada palavra
  SpellChecker.getDictionary("pt-BR", function(err, dictionary) {
    if(!err) {
      for(let spellPalavra of array_palavras) {
        let currPalavra = spellPalavra;
        spellPalavra = spellPalavra.replaceAll('�', '_');
        // var misspelled = !dictionary.spellCheck(spellPalavra);
        var misspelled = !dictionary.spellCheck(spellPalavra);
        console.log(`Está errada == ${misspelled}`)
  
        if(misspelled) {
  
            var suggestions = dictionary.getSuggestions(spellPalavra);
            let numeroCaracteres = spellPalavra.length;
            
            if (!suggestions.length) {
              suggestions = dictionary.getSuggestions(spellPalavra.replaceAll('_', ''));
            }
  
            suggestions = suggestions.filter(item => item.length === numeroCaracteres)
            suggestions = suggestions.filter(item => verificaSeTemCaracterEspecial(item))
            
            // Por vezes aconteciam problemas ao identificar palavras com ç, gerando mais opções
            // Esse filtro limita sugestões 
            if(spellPalavra.includes('ç')) {
              suggestions = suggestions.filter(item => item.includes('ç'));
            }
  
            suggestions = suggestions.filter(item => verficaParteAntesCaracter(spellPalavra, item))
  
            conjuntoPalavras.push(spellPalavra);
  
            if(suggestions.length == 1) {
              console.log(`Suggestions ${currPalavra} === `, suggestions);
            } else {
              console.log(`INDECISO ||| Suggestions ${currPalavra} === `, suggestions);
            }
        }

      }

    }
});    
}

module.exports = {
  verificaGramatica,
}