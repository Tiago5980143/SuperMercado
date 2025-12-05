create database dbSupermercado;
use dbSupermercado;

create table tbCliente(
id_cliente int primary key,
nome varchar(100) not null,
telefone int(13),
Email varchar(100)
);

describe tbcliente;
select * from tbcliente;


create table tbFornecedor(
id_fornecedor int primary key,
nome varchar(200) not null,
contato int(15) not null,
ende varchar(100) not null
);

create table tbVenda(
id_venda int primary key,
data_venda datetime not null,
valor_total decimal(10,2),
id_cliente int,
foreign key (id_cliente) references tbCliente(id_cliente)
);

create table tbProduto(
id_produto int primary key,
nome varchar(100) not null,
categoria varchar(50) not null,
preco decimal (10,2) not null,
estoque int not null,
id_fornecedor int,
foreign key (id_fornecedor) references tbFornecedor(id_fornecedor)
);

create table tbItens_Venda(
id_item int primary key,
quantidade int not null,
subtotal decimal(10,2) not null,
id_venda int,
foreign key (id_venda) references tbVenda(id_venda),
id_produto int,
foreign key (id_produto) references tbProduto(id_produto)
);
