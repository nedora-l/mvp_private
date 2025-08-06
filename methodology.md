# 🛠️ Méthodologie Standard V0

> **Documentation de la démarche standard pour tous les modules**  
> **Dernière mise à jour** : 06/08/2025

## 🎯 **DÉMARCHE V0 LOCALE - STANDARD**

### 1. 📁 **Data persistante**
```
data/
├── projects.json      ✅ Terminé
├── collaborators.json ✅ Terminé  
├── tasks.json         ✅ Terminé
├── sprints.json       🔄 À venir
├── backlogs.json      🔄 À venir
└── [module].json      🔄 Futurs modules
```

### 2. 🌐 **API Routes v0**
```
app/api/v0/
├── projects/          ✅ GET, POST, PUT, DELETE
├── collaborators/     ✅ GET, POST, PUT, DELETE
├── tasks/             ✅ GET, POST, PUT, DELETE
├── sprints/           🔄 À créer
├── backlogs/          🔄 À créer
└── [module]/          🔄 Futurs modules
```

### 3. ⚛️ **Contextes React**
```
contexts/
├── projects-context.tsx      ✅ useProjects()
├── collaborators-context.tsx ✅ useCollaborators()  
├── tasks-context.tsx         ✅ useTasks()
├── sprints-context.tsx       🔄 useSprints()
├── backlogs-context.tsx      🔄 useBacklogs()
└── [module]-context.tsx      🔄 Futurs modules
```

### 4. 🎨 **UI/UX Standard**
```
- Page principale avec filtres et statistiques
- Modals CRUD (création/édition)
- Design moderne et cohérent
- Synchronisation temps réel
- Notifications toast
- Responsive design
```

### 5. 🔗 **Providers Integration**
```typescript
// ClientProviders.tsx
<ProjectsProvider>
  <CollaboratorsProvider>
    <TasksProvider>
      <SprintsProvider>        // 🔄 À ajouter
        <BacklogsProvider>     // 🔄 À ajouter
          {children}
        </BacklogsProvider>
      </SprintsProvider>
    </TasksProvider>
  </CollaboratorsProvider>
</ProjectsProvider>
```

## 🔄 **MIGRATION MCP (Plus tard)**

Quand on passera aux vrais APIs :

```typescript
// ACTUEL (v0 locale)
const response = await fetch('/api/v0/projects');

// FUTUR (MCP server)  
const response = await fetch('/api/mcp/projects');
```

**Avantage** : Seuls les endpoints changent, toute la logique reste !

## ✅ **CHECKLIST NOUVEAU MODULE**

Pour créer un nouveau module :

- [ ] 1. Créer `data/[module].json` avec données test
- [ ] 2. Créer routes API `/api/v0/[module]` et `/api/v0/[module]/[id]`
- [ ] 3. Créer contexte `contexts/[module]-context.tsx`
- [ ] 4. Ajouter provider dans `ClientProviders.tsx`
- [ ] 5. Créer page principale avec CRUD complet
- [ ] 6. Créer modals création/édition
- [ ] 7. Tests et validation UX

## 🎯 **RÈGLES D'OR**

1. **Toujours suivre cette démarche** pour la cohérence
2. **Data locale** → **API v0** → **Contexte** → **UI**
3. **Design moderne** et **UX optimale**
4. **Synchronisation** entre modules
5. **Documentation** à jour

---

*Cette méthodologie garantit la cohérence, la maintenabilité et la facilité de migration vers MCP.*
