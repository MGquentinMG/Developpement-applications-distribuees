'use client';

import React, { useState } from 'react';
import  Navbar  from '../../components/Navbar/Navbar'; 
// Assure-toi que les chemins d'import correspondent à ton arborescence

const MOCK_POSTS = [
  {
    id: 1,
    user: 'Gusty',
    content: 'Et regardez !!!',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=500',
    comments: [
      { id: 101, user: 'User1', content: 'Incroyable cette voiture !' },
      { id: 102, user: 'User2', content: "C'est quel modèle ?" },
    ]
  },
  {
    id: 2,
    user: 'Gusty',
    content: 'Une superbe journée pour coder sur Breezy',
    image: null,
    comments: []
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'messages' | 'reponses'>('messages');
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  
  // VARIABLE MAGIQUE : Passe à "true" pour voir ton propre profil (sans les boutons), 
  // ou "false" pour voir le profil de quelqu'un d'autre (avec les boutons).
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  const toggleComments = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- SECTION EN-TÊTE (Photo + Stats + Bio) --- */}
      <div className="p-6 pt-10">
        <div className="flex gap-6 items-start">
          
          {/* GAUCHE : Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gusty" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {/* L'icône d'édition ne s'affiche que si c'est notre profil */}
            {isOwnProfile && (
              <button className="absolute top-1 right-0 bg-[#A69ACA] p-1.5 rounded-full border-2 border-white shadow-sm text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            )}
          </div>

          {/* DROITE : Boutons, Stats et Bio */}
          <div className="flex-1 w-full">
            
            {/* Boutons (Masqués si c'est notre propre profil) */}
            {!isOwnProfile && (
              <div className="flex gap-3 mb-4">
                <button className="bg-[#A69ACA] text-white px-5 py-2 rounded-full font-semibold text-xs shadow-sm hover:bg-[#9084b8] transition-colors">
                  S'abonner
                </button>
                <button className="bg-[#F4F2F9] text-[#5A4B81] px-5 py-2 rounded-full font-semibold text-xs hover:bg-[#e4dff0] transition-colors">
                  Messages
                </button>
              </div>
            )}

            {/* Statistiques alignées sur la photo */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-black">100K</p>
                <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">Abonnés</p>
              </div>
              <div className="w-[1px] h-6 bg-[#A69ACA]/30"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-black">100K</p>
                <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">Abonnements</p>
              </div>
              <div className="w-[1px] h-6 bg-[#A69ACA]/30"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-black">100K</p>
                <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">Messages</p>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-[#EAE6F3] p-3 rounded-2xl w-full">
              <p className="text-[11px] text-[#2D2D2D] leading-relaxed">
                Le Chat, plus spécifiquement désigné sous le nom de Chat domestique (Felis catus) est une espèce de mammifères de l'Ordre des Carnivores, de la famille des félins (Félidés).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BARRE DE SÉPARATION ÉPAISSE --- */}
      <div className="w-full h-1 bg-gray-100 mb-2"></div>

      {/* --- SECTION ONGLETS --- */}
      <div className="flex px-4 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'messages' ? 'text-black border-b-4 border-[#A69ACA]' : 'text-gray-400'}`}
        >
          Messages
        </button>
        <button 
          onClick={() => setActiveTab('reponses')}
          className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'reponses' ? 'text-black border-b-4 border-[#A69ACA]' : 'text-gray-400'}`}
        >
          Réponses
        </button>
      </div>

      {/* --- LISTE DES POSTS --- */}
      <div className="bg-gray-50/50 min-h-[300px]">
        {activeTab === 'messages' && (
          <div className="divide-y divide-gray-100">
            {MOCK_POSTS.map((post) => (
              <div key={post.id} className="bg-white">
                <div 
                  onClick={() => toggleComments(post.id)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors p-4 flex gap-3"
                >
                   <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gusty" alt="Avatar" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                     <p className="font-bold text-sm text-black">@{post.user}</p>
                     <p className="text-gray-800 text-sm mb-3 mt-1">{post.content}</p>
                     {post.image && (
                       <div className="rounded-2xl overflow-hidden border border-gray-100 max-w-xs">
                          <img src={post.image} alt="Contenu" className="w-full h-auto" />
                       </div>
                     )}
                   </div>
                </div>

                {/* ZONE COMMENTAIRES */}
                {expandedPostId === post.id && (
                  <div className="bg-gray-50 px-14 py-4 space-y-4 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-[#A69ACA] uppercase tracking-widest mb-2">Commentaires</p>
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#A69ACA]/30 shrink-0"></div>
                          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-1">
                            <p className="text-[11px] font-bold text-black mb-1">@{comment.user}</p>
                            <p className="text-xs text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">Aucun commentaire pour le moment.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}