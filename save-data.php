<?php
// Esta é uma implementação simples para salvar dados em um arquivo texto
// Configurações
$dataFile = 'data.json';

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter dados enviados
    $jsonData = file_get_contents('php://input');
    
    // Verificar se os dados são JSON válido
    $data = json_decode($jsonData, true);
    if ($data === null) {
        // Responder com erro caso os dados não sejam válidos
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }
    
    // Salvar dados no arquivo
    $result = file_put_contents($dataFile, $jsonData);
    
    // Verificar se a gravação foi bem-sucedida
    if ($result === false) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar dados']);
        exit;
    }
    
    // Responder sucesso
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
    exit;
} 
// Se não for POST e for GET, devolver o conteúdo do arquivo
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verificar se o arquivo existe
    if (!file_exists($dataFile)) {
        // Criar arquivo vazio com estrutura básica
        $initialData = ['submissions' => [], 'leads' => []];
        file_put_contents($dataFile, json_encode($initialData));
    }
    
    // Ler e retornar o conteúdo do arquivo
    $jsonContent = file_get_contents($dataFile);
    
    header('Content-Type: application/json');
    echo $jsonContent;
    exit;
} else {
    // Método não permitido
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}
?> 