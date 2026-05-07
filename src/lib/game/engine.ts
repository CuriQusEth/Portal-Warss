export type Vector2 = { x: number; y: number };

export enum Team {
  PLAYER,
  ENEMY
}

export enum UnitType {
  WARRIOR,
  MAGE
}

export class Unit {
  id: string;
  pos: Vector2;
  team: Team;
  type: UnitType;
  hp: number;
  maxHp: number;
  speed: number;
  attackDamage: number;
  attackRange: number;
  lastAttackAt: number;
  target: Unit | null = null;
  
  constructor(pos: Vector2, team: Team, type: UnitType) {
    this.id = Math.random().toString(36).substring(7);
    this.pos = { ...pos };
    this.team = team;
    this.type = type;
    this.lastAttackAt = 0;
    
    if (type === UnitType.WARRIOR) {
      this.hp = this.maxHp = 100;
      this.speed = 40;
      this.attackDamage = 10;
      this.attackRange = 15;
    } else {
      this.hp = this.maxHp = 60;
      this.speed = 30;
      this.attackDamage = 25;
      this.attackRange = 80;
    }
  }
}

export class Portal {
  id: string;
  pos: Vector2;
  team: Team;
  hp: number;
  maxHp: number;
  lastSpawnAt: number;
  spawnInterval: number; // ms
  
  constructor(pos: Vector2, team: Team) {
    this.id = Math.random().toString(36).substring(7);
    this.pos = { ...pos };
    this.team = team;
    this.hp = this.maxHp = 500;
    this.lastSpawnAt = Date.now();
    this.spawnInterval = team === Team.PLAYER ? 3000 : 4000;
  }
}

export class GameEngine {
  width: number = 800;
  height: number = 600;
  portals: Portal[] = [];
  units: Unit[] = [];
  particles: { pos: Vector2, vel: Vector2, color: string, life: number, maxLife: number }[] = [];
  
  wave: number = 1;
  score: number = 0;
  lastTick: number = 0;
  isRunning: boolean = false;
  
  eventListeners: { [eventName: string]: Function[] } = {};

  on(event: 'gameOver' | 'waveComplete' | 'scoreUpdate', cb: Function) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(cb);
  }
  
  emit(event: string, payload?: any) {
    if (this.eventListeners[event]) {
        this.eventListeners[event].forEach(cb => cb(payload));
    }
  }

  start(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.portals = [];
    this.units = [];
    this.particles = [];
    this.wave = 1;
    this.score = 0;
    this.isRunning = true;
    this.lastTick = Date.now();
    
    // Spawn initial player portal
    this.portals.push(new Portal({ x: this.width / 2, y: this.height - 100 }, Team.PLAYER));
    
    this.spawnEnemyPortal();
  }

  stop() {
    this.isRunning = false;
  }
  
  spawnEnemyPortal() {
    const margin = 50;
    const x = margin + Math.random() * (this.width - margin * 2);
    const y = margin + Math.random() * (this.height / 3);
    const p = new Portal({ x, y }, Team.ENEMY);
    p.spawnInterval = Math.max(1000, 4000 - (this.wave * 200)); 
    this.portals.push(p);
  }

  addPlayerPortal(pos: Vector2) {
      if (this.portals.filter(p => p.team === Team.PLAYER).length < 3) {
        this.portals.push(new Portal(pos, Team.PLAYER));
      }
  }

  createExplosion(pos: Vector2, color: string, count: number = 10) {
      for(let i=0; i<count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 50 + 20;
        this.particles.push({
            pos: { ...pos },
            vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            color,
            life: 1,
            maxLife: 0.5 + Math.random() * 0.5
        });
      }
  }

  tick() {
    if(!this.isRunning) return;
    
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000; // in seconds
    this.lastTick = now;
    
    // 1. Spawning
    this.portals.forEach(p => {
        if (now - p.lastSpawnAt > p.spawnInterval) {
            this.units.push(new Unit({ ...p.pos }, p.team, Math.random() > 0.7 ? UnitType.MAGE : UnitType.WARRIOR));
            p.lastSpawnAt = now;
            this.createExplosion(p.pos, p.team === Team.PLAYER ? '#3b82f6' : '#ef4444', 5);
        }
    });
    
    // 2. Unit logic
    for (let u of this.units) {
        if (u.hp <= 0) continue;
        
        // Find target
        if (!u.target || u.target.hp <= 0) {
            let closestDist = Infinity;
            let closestUnit: Unit | null = null;
            
            // Look for enemy units
            for (let e of this.units) {
                if (e.team !== u.team && e.hp > 0) {
                    const d = Math.hypot(e.pos.x - u.pos.x, e.pos.y - u.pos.y);
                    if (d < closestDist) {
                        closestDist = d;
                        closestUnit = e;
                    }
                }
            }
            u.target = closestUnit;
        }
        
        if (u.target) {
            // Move towards target
            const dx = u.target.pos.x - u.pos.x;
            const dy = u.target.pos.y - u.pos.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist > u.attackRange) {
                u.pos.x += (dx / dist) * u.speed * dt;
                u.pos.y += (dy / dist) * u.speed * dt;
            } else {
                // Attack
                if (now - u.lastAttackAt > 1000) { // 1 atk/sec
                    u.target.hp -= u.attackDamage;
                    u.lastAttackAt = now;
                    this.createExplosion(u.target.pos, '#fbbf24', 3);
                    
                    if (u.target.hp <= 0) {
                        if (u.team === Team.PLAYER) {
                            this.score += 10;
                            this.emit('scoreUpdate', this.score);
                        }
                    }
                }
            }
        } else {
            // No unit target, attack portals
            let closestDist = Infinity;
            let closestPortal: Portal | null = null;
            for (let p of this.portals) {
                if (p.team !== u.team && p.hp > 0) {
                     const d = Math.hypot(p.pos.x - u.pos.x, p.pos.y - u.pos.y);
                    if (d < closestDist) {
                        closestDist = d;
                        closestPortal = p;
                    }
                }
            }
            if (closestPortal) {
                const dx = closestPortal.pos.x - u.pos.x;
                const dy = closestPortal.pos.y - u.pos.y;
                const dist = Math.hypot(dx, dy);
                if (dist > u.attackRange + 15) {
                    u.pos.x += (dx / dist) * u.speed * dt;
                    u.pos.y += (dy / dist) * u.speed * dt;
                } else {
                    if (now - u.lastAttackAt > 1000) {
                        closestPortal.hp -= u.attackDamage;
                        u.lastAttackAt = now;
                        this.createExplosion(closestPortal.pos, '#fbbf24', 5);
                        
                        if (closestPortal.hp <= 0) {
                            if (u.team === Team.PLAYER) {
                                this.score += 50;
                                this.emit('scoreUpdate', this.score);
                            }
                        }
                    }
                }
            }
        }
    }
    
    // 3. Update Particles
    this.particles.forEach(p => {
        p.pos.x += p.vel.x * dt;
        p.pos.y += p.vel.y * dt;
        p.life -= dt;
    });
    
    // 4. Cleanup
    this.units = this.units.filter(u => u.hp > 0);
    this.particles = this.particles.filter(p => p.life > 0);
    
    // Check Wave complete / Game over
    const playerPortals = this.portals.filter(p => p.team === Team.PLAYER && p.hp > 0);
    const enemyPortals = this.portals.filter(p => p.team === Team.ENEMY && p.hp > 0);
    
    this.portals = this.portals.filter(p => p.hp > 0);
    
    if (playerPortals.length === 0) {
        this.isRunning = false;
        this.emit('gameOver', this.score);
    } else if (enemyPortals.length === 0) {
        this.wave++;
        this.score += 100;
        this.emit('scoreUpdate', this.score);
        this.emit('waveComplete', this.wave);
        
        // Spawn more portals for new wave
        for(let i=0; i < Math.min(this.wave, 4); i++){
             this.spawnEnemyPortal();
        }
    }
  }
}
