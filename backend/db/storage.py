import sqlite3
import json
import os
from typing import List, Optional
from models.schemas import AnalyzeResponse

DB_PATH = os.path.join(os.path.dirname(__file__), 'history.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            status TEXT NOT NULL,
            tests_generated INTEGER DEFAULT 0,
            api_endpoints INTEGER DEFAULT 0,
            coverage INTEGER DEFAULT 0,
            analyzed_at TEXT,
            results TEXT,
            error TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_analysis(analysis: AnalyzeResponse):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    results_str = json.dumps(analysis.results) if analysis.results else None
    
    cursor.execute('''
        INSERT OR REPLACE INTO analysis 
        (id, url, status, tests_generated, api_endpoints, coverage, analyzed_at, results, error)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        analysis.id, 
        str(analysis.url), 
        analysis.status, 
        analysis.tests_generated, 
        analysis.api_endpoints, 
        analysis.coverage, 
        analysis.analyzed_at, 
        results_str,
        analysis.error
    ))
    conn.commit()
    conn.close()

def get_analysis(analysis_id: str) -> Optional[AnalyzeResponse]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analysis WHERE id = ?', (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return AnalyzeResponse(
            id=row[0],
            url=row[1],
            status=row[2],
            tests_generated=row[3],
            api_endpoints=row[4],
            coverage=row[5],
            analyzed_at=row[6],
            results=json.loads(row[7]) if row[7] else None,
            error=row[8]
        )
    return None

def get_all_analyses() -> List[AnalyzeResponse]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analysis ORDER BY analyzed_at DESC')
    rows = cursor.fetchall()
    conn.close()
    
    analyses = []
    for row in rows:
        analyses.append(AnalyzeResponse(
            id=row[0],
            url=row[1],
            status=row[2],
            tests_generated=row[3],
            api_endpoints=row[4],
            coverage=row[5],
            analyzed_at=row[6],
            results=json.loads(row[7]) if row[7] else None,
            error=row[8]
        ))
    return analyses

# Initialize the database when the module is loaded
init_db()
