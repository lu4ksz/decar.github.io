// Sistema de armazenamento simples usando arquivo de texto
const DATA_SYNC = {
    // Arquivo para sincronização de dados
    DATA_FILE: 'save-data.php',
    
    // Carregar todos os dados
    loadData: async function() {
        try {
            const response = await fetch(this.DATA_FILE);
            if (!response.ok) {
                throw new Error('Falha ao carregar dados');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            // Retorna dados vazios em caso de erro
            return { submissions: [], leads: [] };
        }
    },
    
    // Salvar todos os dados
    saveData: async function(data) {
        try {
            const response = await fetch(this.DATA_FILE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Falha ao salvar dados');
            }
            
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    },
    
    // Salvar um novo formulário preenchido
    saveSubmission: async function(submission, lead) {
        const data = await this.loadData();
        
        // Adicionar submissão
        data.submissions.push(submission);
        
        // Adicionar lead
        data.leads.push(lead);
        
        // Salvar dados
        return await this.saveData(data);
    },
    
    // Atualizar o status de um lead
    updateLead: async function(leadId, newStatus, note) {
        const data = await this.loadData();
        let updated = false;
        
        // Encontrar e atualizar o lead
        for (let i = 0; i < data.leads.length; i++) {
            if (data.leads[i].id === leadId) {
                // Atualizar status
                data.leads[i].status = newStatus;
                data.leads[i].ultimaAtualizacao = new Date().toISOString();
                
                // Adicionar nota
                if (note && note.trim() !== '') {
                    if (!data.leads[i].notas) {
                        data.leads[i].notas = [];
                    }
                    
                    data.leads[i].notas.push({
                        data: new Date().toISOString(),
                        status: newStatus,
                        texto: note
                    });
                }
                
                updated = true;
                break;
            }
        }
        
        if (updated) {
            // Salvar dados atualizados
            return await this.saveData(data);
        }
        
        return false;
    },
    
    // Excluir um registro
    deleteEntry: async function(id, type = 'submission') {
        const data = await this.loadData();
        let deleted = false;
        
        if (type === 'lead') {
            // Remover o lead
            const newLeads = data.leads.filter(lead => lead.id !== id);
            if (newLeads.length !== data.leads.length) {
                data.leads = newLeads;
                deleted = true;
            }
        } else {
            // Remover a submissão
            const newSubmissions = data.submissions.filter(sub => sub.id !== id);
            if (newSubmissions.length !== data.submissions.length) {
                data.submissions = newSubmissions;
                deleted = true;
            }
        }
        
        if (deleted) {
            // Salvar dados atualizados
            return await this.saveData(data);
        }
        
        return false;
    }
}; 