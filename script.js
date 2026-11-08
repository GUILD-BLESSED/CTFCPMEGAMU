function calcularPagamento() {
    const eventoSelecionado = document.getElementById('evento').value;
    const premioDobro = document.getElementById('premioDobro').checked; // Verifica se a opção está marcada
    const colocacoesSelecionadas = document.querySelectorAll('input[name="colocacao"]:checked');
    const numeroDeJogadores = parseInt(document.getElementById('jogadores').value);
    const resultadoDiv = document.getElementById('resultado');

    if (colocacoesSelecionadas.length === 0) {
        resultadoDiv.innerHTML = "<p>Por favor, selecione pelo menos uma colocação.</p>";
        return;
    }

    if (isNaN(numeroDeJogadores) || numeroDeJogadores < 1) {
        resultadoDiv.innerHTML = "<p>Por favor, insira um número válido de jogadores.</p>";
        return;
    }

    // Define os prêmios base
    const multiplicador = premioDobro ? 2 : 1; // Define o multiplicador
    const premiosCP = {
        1: 5000 * multiplicador,
        2: 2500 * multiplicador,
        3: 1500 * multiplicador,
        4: 1250 * multiplicador,
        5: 1000 * multiplicador
    };
    const premiosCTF = {
        1: 3750 * multiplicador,
        2: 2500 * multiplicador,
        3: 2500 * multiplicador,
        4: 2500 * multiplicador,
        5: 1250 * multiplicador
    };

    const premiosDoEvento = eventoSelecionado === 'CP' ? premiosCP : premiosCTF;

    let premiacaoTotal = 0;
    const premiosPorGuild = [];

    colocacoesSelecionadas.forEach(colocacao => {
        const posicao = parseInt(colocacao.value);
        const premio = premiosDoEvento[posicao];
        premiacaoTotal += premio;
        premiosPorGuild.push({ posicao, premio });
    });

    const pagamentoPorJogador = premiacaoTotal / numeroDeJogadores;

    const tituloResultado = premioDobro 
        ? `Resultado do Evento ${eventoSelecionado} (Prêmio em Dobro)` 
        : `Resultado do Evento ${eventoSelecionado}`;

    let resultadoHTML = `
        <h2>${tituloResultado}</h2>
        <p><strong>Premiação Total da Aliança:</strong> ${premiacaoTotal.toLocaleString('pt-BR')} MP</p>
        <p><strong>Número de Jogadores:</strong> ${numeroDeJogadores}</p>
        <p><strong>Cada jogador deve receber:</strong> ${pagamentoPorJogador.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MP</p>
        <h3>Contribuição de Cada Líder para o Rateio:</h3>
        <ul>
    `;
    
    premiosPorGuild.sort((a, b) => a.posicao - b.posicao);

    premiosPorGuild.forEach(guild => {
        const excedente = guild.premio - pagamentoPorJogador;

        if (excedente > 0) {
            resultadoHTML += `<li class="pagar">O líder da guild do ${guild.posicao}º lugar (prêmio de ${guild.premio.toLocaleString('pt-BR')} MP) deve <strong>pagar o excedente de ${excedente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MP</strong> ao caixa da aliança.</li>`;
        } else if (excedente < 0) {
            resultadoHTML += `<li class="receber">O líder da guild do ${guild.posicao}º lugar (prêmio de ${guild.premio.toLocaleString('pt-BR')} MP) deve <strong>receber ${Math.abs(excedente).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MP</strong> do caixa da aliança para completar sua parte.</li>`;
        } else {
            resultadoHTML += `<li>O prêmio da guild do ${guild.posicao}º lugar (${guild.premio.toLocaleString('pt-BR')} MP) cobre exatamente a parte do líder, sem sobras.</li>`;
        }
    });

    resultadoHTML += `</ul>`;
    resultadoDiv.innerHTML = resultadoHTML;
}