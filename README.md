- Account
- Produto - criar/alterar/excluir
- Categoria - criar/alterar/excluir
  
- eu posso adicionar um/varios produto a categoria;

- ao criar um produto, eu adiciono o produto a queue (rabbitmq);
- o consumer vai consumir a queue, buscar o produto no bd e criar um file no S3;

- o controller não busca do bd, mas sim do S3;