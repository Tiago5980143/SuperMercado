// script.js
// Simulação do banco de dados em memória + localStorage
// Estruturas baseadas no dicionário de dados do projeto:

// Produtos: id_produto, nome, categoria, preco, estoque, id_fornecedor
// Clientes: id_cliente, nome, telefone, email
// Fornecedores: id_fornecedor, nome, contato, end
// Vendas: id_venda, id_cliente, data_venda, valor_total
// Itens_Venda: id_item, id_venda, id_produto, quantidade, subtotal

// "Banco" em memória
let fornecedores = [];
let produtos = [];
let clientes = [];
let vendas = [];
let itensVenda = []; // todos os itens de todas as vendas

// Itens temporários da venda que está sendo montada na tela
let itensVendaAtuais = [];

// Contadores de ID (PK)
let nextFornecedorId = 1;
let nextProdutoId = 1;
let nextClienteId = 1;
let nextVendaId = 1;
let nextItemId = 1;

// ------------------------- Persistência em localStorage -------------------------

const STORAGE_KEY = "supermercadoBD";

function salvarNoStorage() {
    const data = {
        fornecedores,
        produtos,
        clientes,
        vendas,
        itensVenda,
        nextFornecedorId,
        nextProdutoId,
        nextClienteId,
        nextVendaId,
        nextItemId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function carregarDoStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        fornecedores = data.fornecedores || [];
        produtos = data.produtos || [];
        clientes = data.clientes || [];
        vendas = data.vendas || [];
        itensVenda = data.itensVenda || [];
        nextFornecedorId = data.nextFornecedorId || 1;
        nextProdutoId = data.nextProdutoId || 1;
        nextClienteId = data.nextClienteId || 1;
        nextVendaId = data.nextVendaId || 1;
        nextItemId = data.nextItemId || 1;
    } catch (e) {
        console.error("Erro ao carregar dados do storage:", e);
    }
}

// ------------------------------ Utilidades ------------------------------

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function encontrarFornecedorPorId(id) {
    return fornecedores.find(f => f.id_fornecedor === id);
}

function encontrarProdutoPorId(id) {
    return produtos.find(p => p.id_produto === id);
}

function encontrarClientePorId(id) {
    return clientes.find(c => c.id_cliente === id);
}

// ------------------------------ Tabs / Navegação ------------------------------

function configurarTabs() {
    const buttons = document.querySelectorAll(".tab-button");
    const sections = document.querySelectorAll(".tab-section");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active"));

            btn.classList.add("active");
            const sectionId = btn.getAttribute("data-section");
            document.getElementById(sectionId).classList.add("active");
        });
    });
}

// ------------------------------ Renderização ------------------------------

function renderizarFornecedores() {
    const tbody = document.getElementById("tabelaFornecedores");
    tbody.innerHTML = "";

    fornecedores.forEach(f => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
      <td>${f.id_fornecedor}</td>
      <td>${f.nome}</td>
      <td>${f.contato || ""}</td>
      <td>${f.end || ""}</td>
      <td>
        <button class="btn danger btn-remover-fornecedor" data-id="${f.id_fornecedor}">
          Excluir
        </button>
      </td>
    `;

        tbody.appendChild(tr);
    });

    // Popular select de fornecedor em Produtos
    const selectFornecedor = document.getElementById("fornecedorProduto");
    selectFornecedor.innerHTML = `<option value="">Selecione um fornecedor</option>`;
    fornecedores.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.id_fornecedor;
        opt.textContent = `${f.id_fornecedor} - ${f.nome}`;
        selectFornecedor.appendChild(opt);
    });

    // Eventos de exclusão
    document.querySelectorAll(".btn-remover-fornecedor").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"), 10);

            // Simples: impedir exclusão se houver produtos vinculados
            const existeProduto = produtos.some(p => p.id_fornecedor === id);
            if (existeProduto) {
                alert("Não é possível excluir o fornecedor: existem produtos vinculados a ele.");
                return;
            }

            if (confirm("Deseja realmente excluir este fornecedor?")) {
                fornecedores = fornecedores.filter(f => f.id_fornecedor !== id);
                salvarNoStorage();
                renderizarFornecedores();
            }
        });
    });
}

function renderizarProdutos() {
    const tbody = document.getElementById("tabelaProdutos");
    tbody.innerHTML = "";

    produtos.forEach(p => {
        const fornecedor = encontrarFornecedorPorId(p.id_fornecedor);
        const nomeFornecedor = fornecedor ? fornecedor.nome : "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${p.id_produto}</td>
      <td>${p.nome}</td>
      <td>${p.categoria || ""}</td>
      <td>${formatarMoeda(p.preco)}</td>
      <td>${p.estoque}</td>
      <td>${nomeFornecedor}</td>
      <td>
        <button class="btn danger btn-remover-produto" data-id="${p.id_produto}">
          Excluir
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    // Popular select de produtos na venda
    const selectProduto = document.getElementById("produtoItem");
    selectProduto.innerHTML = `<option value="">Selecione um produto</option>`;
    produtos.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id_produto;
        opt.textContent = `${p.id_produto} - ${p.nome} (Estoque: ${p.estoque})`;
        selectProduto.appendChild(opt);
    });

    // Eventos de exclusão
    document.querySelectorAll(".btn-remover-produto").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"), 10);

            // Impedir exclusão se houver itens de venda vinculados
            const existeItem = itensVenda.some(iv => iv.id_produto === id);
            if (existeItem) {
                alert("Não é possível excluir o produto: ele já aparece em itens de venda.");
                return;
            }

            if (confirm("Deseja realmente excluir este produto?")) {
                produtos = produtos.filter(p => p.id_produto !== id);
                salvarNoStorage();
                renderizarProdutos();
            }
        });
    });
}

function renderizarClientes() {
    const tbody = document.getElementById("tabelaClientes");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${c.id_cliente}</td>
      <td>${c.nome}</td>
      <td>${c.telefone || ""}</td>
      <td>${c.email || ""}</td>
      <td>
        <button class="btn danger btn-remover-cliente" data-id="${c.id_cliente}">
          Excluir
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    // Popular select de clientes na venda
    const selectCliente = document.getElementById("clienteVenda");
    selectCliente.innerHTML = `<option value="">Selecione um cliente</option>`;
    clientes.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id_cliente;
        opt.textContent = `${c.id_cliente} - ${c.nome}`;
        selectCliente.appendChild(opt);
    });

    // Eventos de exclusão
    document.querySelectorAll(".btn-remover-cliente").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"), 10);

            // Impedir exclusão se houver vendas deste cliente
            const existeVenda = vendas.some(v => v.id_cliente === id);
            if (existeVenda) {
                alert("Não é possível excluir o cliente: existem vendas associadas.");
                return;
            }

            if (confirm("Deseja realmente excluir este cliente?")) {
                clientes = clientes.filter(c => c.id_cliente !== id);
                salvarNoStorage();
                renderizarClientes();
            }
        });
    });
}

function renderizarItensVendaAtuais() {
    const tbody = document.getElementById("tabelaItensVenda");
    tbody.innerHTML = "";

    let total = 0;

    itensVendaAtuais.forEach(item => {
        total += item.subtotal;

        const produto = encontrarProdutoPorId(item.id_produto);
        const nomeProduto = produto ? produto.nome : "Produto removido";

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${nomeProduto}</td>
      <td>${item.quantidade}</td>
      <td>${formatarMoeda(item.preco_unitario)}</td>
      <td>${formatarMoeda(item.subtotal)}</td>
      <td>
        <button class="btn danger btn-remover-item-temp" data-id="${item.id_temp}">
          Remover
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    document.getElementById("valorTotalVenda").textContent = formatarMoeda(total);

    // Eventos para remover item temporário
    document.querySelectorAll(".btn-remover-item-temp").forEach(btn => {
        btn.addEventListener("click", () => {
            const idTemp = parseInt(btn.getAttribute("data-id"), 10);
            itensVendaAtuais = itensVendaAtuais.filter(i => i.id_temp !== idTemp);
            renderizarItensVendaAtuais();
        });
    });
}

function renderizarVendas() {
    const tbody = document.getElementById("tabelaVendas");
    tbody.innerHTML = "";

    vendas.forEach(v => {
        const cliente = encontrarClientePorId(v.id_cliente);
        const nomeCliente = cliente ? cliente.nome : "Cliente removido";

        const itensDaVenda = itensVenda.filter(iv => iv.id_venda === v.id_venda);

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${v.id_venda}</td>
      <td>${nomeCliente}</td>
      <td>${v.data_venda}</td>
      <td>${formatarMoeda(v.valor_total)}</td>
      <td>${itensDaVenda.length}</td>
    `;
        tbody.appendChild(tr);
    });
}

// ------------------------------ Formulários ------------------------------

// Fornecedor
function configurarFormularioFornecedor() {
    const form = document.getElementById("form-fornecedor");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeFornecedor").value.trim();
        const contato = document.getElementById("contatoFornecedor").value.trim();
        const end = document.getElementById("endFornecedor").value.trim();

        if (!nome) {
            alert("O nome do fornecedor é obrigatório.");
            return;
        }

        const fornecedor = {
            id_fornecedor: nextFornecedorId++,
            nome,
            contato,
            end
        };

        fornecedores.push(fornecedor);
        salvarNoStorage();
        form.reset();
        renderizarFornecedores();
        alert("Fornecedor cadastrado com sucesso!");
    });
}

// Produto
function configurarFormularioProduto() {
    const form = document.getElementById("form-produto");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeProduto").value.trim();
        const categoria = document.getElementById("categoriaProduto").value.trim();
        const preco = parseFloat(document.getElementById("precoProduto").value);
        const estoque = parseInt(document.getElementById("estoqueProduto").value, 10);
        const idFornecedor = parseInt(document.getElementById("fornecedorProduto").value, 10);

        if (!nome || isNaN(preco) || isNaN(estoque) || isNaN(idFornecedor)) {
            alert("Preencha todos os campos obrigatórios de produto.");
            return;
        }

        const produto = {
            id_produto: nextProdutoId++,
            nome,
            categoria,
            preco,
            estoque,
            id_fornecedor: idFornecedor
        };

        produtos.push(produto);
        salvarNoStorage();
        form.reset();
        renderizarProdutos();
        alert("Produto cadastrado com sucesso!");
    });
}

// Cliente
function configurarFormularioCliente() {
    const form = document.getElementById("form-cliente");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeCliente").value.trim();
        const telefone = document.getElementById("telefoneCliente").value.trim();
        const email = document.getElementById("emailCliente").value.trim();

        if (!nome) {
            alert("O nome do cliente é obrigatório.");
            return;
        }

        const cliente = {
            id_cliente: nextClienteId++,
            nome,
            telefone,
            email
        };

        clientes.push(cliente);
        salvarNoStorage();
        form.reset();
        renderizarClientes();
        alert("Cliente cadastrado com sucesso!");
    });
}

// Vendas
function configurarFormularioVenda() {
    const form = document.getElementById("form-venda");
    const btnAddItem = document.getElementById("btnAddItem");

    // Preenche data/hora atual por padrão
    const campoData = document.getElementById("dataVenda");
    if (!campoData.value) {
        campoData.value = new Date().toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    }

    btnAddItem.addEventListener("click", () => {
        const idProduto = parseInt(document.getElementById("produtoItem").value, 10);
        const qtd = parseInt(document.getElementById("quantidadeItem").value, 10);

        if (isNaN(idProduto) || isNaN(qtd) || qtd <= 0) {
            alert("Selecione um produto e informe uma quantidade válida.");
            return;
        }

        const produto = encontrarProdutoPorId(idProduto);
        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }

        // Verificar estoque disponível (considerando itens já adicionados nesta venda)
        const qtdJaAdicionada = itensVendaAtuais
            .filter(i => i.id_produto === idProduto)
            .reduce((soma, i) => soma + i.quantidade, 0);

        if (qtd + qtdJaAdicionada > produto.estoque) {
            alert(`Estoque insuficiente. Estoque atual do produto: ${produto.estoque}.`);
            return;
        }

        const precoUnit = produto.preco;
        const subtotal = precoUnit * qtd;

        const itemTemp = {
            id_temp: Date.now() + Math.random(), // ID temporário só para remover na tela
            id_produto: idProduto,
            quantidade: qtd,
            preco_unitario: precoUnit,
            subtotal
        };

        itensVendaAtuais.push(itemTemp);
        renderizarItensVendaAtuais();

        // Reseta campo de item
        document.getElementById("produtoItem").value = "";
        document.getElementById("quantidadeItem").value = 1;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const idCliente = parseInt(document.getElementById("clienteVenda").value, 10);
        const dataVenda = document.getElementById("dataVenda").value;

        if (isNaN(idCliente)) {
            alert("Selecione um cliente para a venda.");
            return;
        }

        if (!dataVenda) {
            alert("Informe a data e hora da venda.");
            return;
        }

        if (itensVendaAtuais.length === 0) {
            alert("Adicione pelo menos um item à venda.");
            return;
        }

        const valorTotal = itensVendaAtuais.reduce((soma, item) => soma + item.subtotal, 0);

        const venda = {
            id_venda: nextVendaId++,
            id_cliente: idCliente,
            data_venda: dataVenda,
            valor_total: valorTotal
        };

        vendas.push(venda);

        // Para cada item temporário, cria um registro em Itens_Venda (com PK própria)
        itensVendaAtuais.forEach(itemTemp => {
            const itemVenda = {
                id_item: nextItemId++,
                id_venda: venda.id_venda,
                id_produto: itemTemp.id_produto,
                quantidade: itemTemp.quantidade,
                subtotal: itemTemp.subtotal
            };
            itensVenda.push(itemVenda);

            // Atualiza estoque do produto
            const produto = encontrarProdutoPorId(itemTemp.id_produto);
            if (produto) {
                produto.estoque -= itemTemp.quantidade;
                if (produto.estoque < 0) produto.estoque = 0;
            }
        });

        // Limpar itens atuais e atualizar telas
        itensVendaAtuais = [];
        renderizarItensVendaAtuais();
        renderizarProdutos();
        renderizarVendas();

        salvarNoStorage();
        alert("Venda registrada com sucesso!");

        // Reset básico (mantém data/hora preenchida)
        document.getElementById("clienteVenda").value = "";
    });
}

// ------------------------------ Inicialização ------------------------------

document.addEventListener("DOMContentLoaded", () => {
    carregarDoStorage();
    configurarTabs();

    configurarFormularioFornecedor();
    configurarFormularioProduto();
    configurarFormularioCliente();
    configurarFormularioVenda();

    renderizarFornecedores();
    renderizarProdutos();
    renderizarClientes();
    renderizarItensVendaAtuais();
    renderizarVendas();
});
