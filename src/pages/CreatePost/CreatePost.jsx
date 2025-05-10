import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError ] = useState(null);
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!currentUser) {
            setError("Voce precisa estar logado para cirar um post!");
            return;
        }
        
        
        try {
            const postData = {
                title,
                content,
                uid: currentUser.uid,
                authorId: currentUser.uid,
                author: currentUser.email
                ,
                createdAt: serverTimestamp(),
                likes: 0,
                comments: []
        };

        console.log('Enviando para o Firebase:', postData);

        const docRef = await addDoc(collection(db, 'posts'), postData);
        
        console.log('Post Salvo com ID:' , docRef.id);
        navigate('/dashboard');
    } catch (err) {
        console.error("Erro ao criar post:", err);
        setError('Erro ao salvar:' + err.message);
    }
};
    

return (
    <div className="create-post">
        <h1>Criar novo post</h1>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label>Titulo</label>
            <input 
            type="text" 
            placeholder='Título'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            />
            </div>

            <div className="form-group">
            <label>Conteudo</label>
            <textarea 
            placeholder='Conteúdo'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
            />
            </div>
            
            <button type="submit" className="submit-btn">
                Publicar Post
            </button>
            </form>
            </div>
);
}

