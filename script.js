document.addEventListener("DOMContentLoaded", () => {
    const formCliente = document.getElementById("form-cliente");

    formCliente.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Captura os dados do formulário
        const nome = document.getElementById("nomeCliente").value;
        const telefone = document.getElementById("telefoneCliente").value;
        const email = document.getElementById("emailCliente").value;

        try {
            // Envia os dados para o servidor
            const response = await fetch("/Usuario/Cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, telefone, email }),
            });

            if (response.ok) {
                alert("Cliente salvo com sucesso!");
                formCliente.reset(); // Limpa o formulário
            } else {
                const errorMessage = await response.text();
                alert("Erro ao salvar cliente: " + errorMessage);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao salvar cliente. Tente novamente mais tarde.");
        }
    });
});