export function formatFullName(fullName: string): string {
  if (!fullName) {
    return '';
  }

  // 1. Converter tudo para minúsculas
  const lowerCaseName = fullName.toLowerCase();

  // 2. Dividir o nome em palavras
  const words = lowerCaseName.split(' ');

  // 3. Processar cada palavra
  const formattedWords = words.map(word => {
    // Palavras com 2 ou menos letras (preposições, artigos, etc.) permanecem em minúsculas
    // Ex: de, da, do, dos, e, as
    if (word.length <= 2) {
      return word;
    }
    // Primeira letra maiúscula, o restante minúsculas
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // 4. Juntar as palavras formatadas de volta em uma string
  return formattedWords.join(' ');
}