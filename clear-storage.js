// Script para limpar o localStorage e forçar recriação dos dados
// Execute no console do navegador: localStorage.clear()

console.log('Para limpar o localStorage, execute no console do navegador:');
console.log('localStorage.clear()');
console.log('Isso forçará a recriação dos dados com os novos campos.');

// Alternativamente, você pode executar este código no console:
if (typeof window !== 'undefined' && window.localStorage) {
    const confirmClear = confirm('Deseja limpar o localStorage? Isso recriará todos os dados.');
    if (confirmClear) {
        localStorage.clear();
        console.log('localStorage limpo com sucesso! Recarregue a página.');
        window.location.reload();
    }
} else {
    console.log('Este script deve ser executado no navegador.');
}
