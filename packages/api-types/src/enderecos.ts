export interface EnderecoDto {
  id: number;
  rua: string;
  numero: number | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface EnderecoRefDto {
  id: number;
  rua: string;
  numero: number | null;
}
