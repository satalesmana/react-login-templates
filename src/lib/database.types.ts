export type Database = {
  public: {
    Tables: {
      dompet: {
        Row: {
          id: string;
          user_id: string;
          nama: string;
          jenis: string;
          saldo: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nama: string;
          jenis: string;
          saldo?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nama?: string;
          jenis?: string;
          saldo?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
