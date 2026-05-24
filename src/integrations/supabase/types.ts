export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          avaliado_matricula: string
          avaliador_matricula: string
          ciclo_id: string | null
          comentario: string | null
          competencia: string
          created_at: string
          id: number
          nota: number | null
        }
        Insert: {
          avaliado_matricula: string
          avaliador_matricula: string
          ciclo_id?: string | null
          comentario?: string | null
          competencia: string
          created_at?: string
          id?: number
          nota?: number | null
        }
        Update: {
          avaliado_matricula?: string
          avaliador_matricula?: string
          ciclo_id?: string | null
          comentario?: string | null
          competencia?: string
          created_at?: string
          id?: number
          nota?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_avaliado_matricula_fkey"
            columns: ["avaliado_matricula"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["matricula"]
          },
          {
            foreignKeyName: "avaliacoes_avaliador_matricula_fkey"
            columns: ["avaliador_matricula"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["matricula"]
          },
          {
            foreignKeyName: "avaliacoes_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos_avaliacao"
            referencedColumns: ["ciclo_id"]
          },
        ]
      }
      ciclos_avaliacao: {
        Row: {
          ciclo_id: string
          config: Json
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          nome: string
          status: string
          updated_at: string
        }
        Insert: {
          ciclo_id?: string
          config?: Json
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          nome: string
          status?: string
          updated_at?: string
        }
        Update: {
          ciclo_id?: string
          config?: Json
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          nome?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      colaboradores: {
        Row: {
          altura: number | null
          bairro: string | null
          cargo: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          data_nasc: string | null
          departamento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          foto_url: string | null
          idade: number | null
          mae: string | null
          matricula: string
          nome: string
          numero: string | null
          pai: string | null
          peso: number | null
          resp_adaptacao: number | null
          resp_competencia_tecnica: number | null
          resp_comunicacao: number | null
          resp_desenvolvimento: number | null
          resp_etica: number | null
          resp_iniciativa: number | null
          resp_lideranca: number | null
          resp_orientacao_cliente: number | null
          resp_produtividade: number | null
          resp_qualidade_trabalho: number | null
          resp_resolucao_problemas: number | null
          resp_trabalho_em_equipe: number | null
          rg: string | null
          sexo: string | null
          telefone_fixo: string | null
          updated_at: string
        }
        Insert: {
          altura?: number | null
          bairro?: string | null
          cargo?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_nasc?: string | null
          departamento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          foto_url?: string | null
          idade?: number | null
          mae?: string | null
          matricula: string
          nome: string
          numero?: string | null
          pai?: string | null
          peso?: number | null
          resp_adaptacao?: number | null
          resp_competencia_tecnica?: number | null
          resp_comunicacao?: number | null
          resp_desenvolvimento?: number | null
          resp_etica?: number | null
          resp_iniciativa?: number | null
          resp_lideranca?: number | null
          resp_orientacao_cliente?: number | null
          resp_produtividade?: number | null
          resp_qualidade_trabalho?: number | null
          resp_resolucao_problemas?: number | null
          resp_trabalho_em_equipe?: number | null
          rg?: string | null
          sexo?: string | null
          telefone_fixo?: string | null
          updated_at?: string
        }
        Update: {
          altura?: number | null
          bairro?: string | null
          cargo?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_nasc?: string | null
          departamento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          foto_url?: string | null
          idade?: number | null
          mae?: string | null
          matricula?: string
          nome?: string
          numero?: string | null
          pai?: string | null
          peso?: number | null
          resp_adaptacao?: number | null
          resp_competencia_tecnica?: number | null
          resp_comunicacao?: number | null
          resp_desenvolvimento?: number | null
          resp_etica?: number | null
          resp_iniciativa?: number | null
          resp_lideranca?: number | null
          resp_orientacao_cliente?: number | null
          resp_produtividade?: number | null
          resp_qualidade_trabalho?: number | null
          resp_resolucao_problemas?: number | null
          resp_trabalho_em_equipe?: number | null
          rg?: string | null
          sexo?: string | null
          telefone_fixo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feedbacks_finais: {
        Row: {
          avaliado_matricula: string
          ciclo_id: string | null
          created_at: string
          gap_gestor_auto: number | null
          id: string
          indicadores: Json
          indice_potencial: number | null
          nota_media: number | null
          percentil_empresa: number | null
          rater_breakdown: Json | null
        }
        Insert: {
          avaliado_matricula: string
          ciclo_id?: string | null
          created_at?: string
          gap_gestor_auto?: number | null
          id?: string
          indicadores?: Json
          indice_potencial?: number | null
          nota_media?: number | null
          percentil_empresa?: number | null
          rater_breakdown?: Json | null
        }
        Update: {
          avaliado_matricula?: string
          ciclo_id?: string | null
          created_at?: string
          gap_gestor_auto?: number | null
          id?: string
          indicadores?: Json
          indice_potencial?: number | null
          nota_media?: number | null
          percentil_empresa?: number | null
          rater_breakdown?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_finais_avaliado_matricula_fkey"
            columns: ["avaliado_matricula"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["matricula"]
          },
          {
            foreignKeyName: "feedbacks_finais_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos_avaliacao"
            referencedColumns: ["ciclo_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          matricula: string | null
          nome: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          matricula?: string | null
          nome?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          matricula?: string | null
          nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_matricula_fkey"
            columns: ["matricula"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["matricula"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "rh" | "gestor" | "colaborador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "rh", "gestor", "colaborador"],
    },
  },
} as const
